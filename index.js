const express = require("express");
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs');
const User = require("./models/user.model");
const Comment = require("./models/comment.model");
const Question = require("./models/question.model");


main(console.log("mongo connection open")).catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/forum");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret:'forum',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());

const requireLogin = (req,res,next) =>{
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

app.get('/', async (req,res) => {
    const questions = await Question.find({}).populate('comments').populate('user')
    res.render('index',{questions, message:req.flash('error')})
})

app.get('/questions/create', async (req,res) => {
    res.render('questions/create')
})

app.post('/questions', async (req,res) => {
    const q =  new Question(req.body)
    await q.save()
    res.redirect('/')
})

app.get('/questions/:id', async (req,res) => {
    const {id} = req.params
    const question = await Question.findById(id).populate('comments')
    
    res.render('questions/show',{question})
})

app.post('/questions/:id/comments', async (req,res) => {
    try {
        const {id} = req.params
        const {title} = req.body
        const comment =  new Comment({title}) 
        const question = await Question.findById(id)
        question.comments.push(comment)
        comment.question = question
        await comment.save()
       await question.save()
       res.redirect('/questions/'+id)
    } catch (error) {
        res.send(error.errors.title.message)
    }
   
    
    
})

// auth routes
app.get('/login', (req,res) => {
    // res.send(req.flash('error'))
    res.render('login', {message:req.flash('error')})
})
app.post('/login', async (req,res) => {
    const {password, username} = req.body
  
   const foundUser = await User.findAndValidate(username, password)
//    const validPassword = await bcrypt.compare(password, user.password)
   if (!foundUser) {
    req.flash('error', `Error credentials incorrect`)
    res.redirect('login');
   } else {
    req.session.user_id = foundUser._id
    res.redirect('/')
   }
   
})

app.get('/register', (req,res) => {
    res.render('register')
})
app.post('/register', async (req,res) => {
    const {password, username} = req.body
   const hash =  await bcrypt.hash(password,12)
    // res.send(hash)
   const user =  new User({
    username,
   password: hash
   })

   await user.save()
   req.session.user_id = user._id
   res.redirect('/')
})

app.post('/logout', requireLogin, (req,res) => {
    req.session.user_id = null;
    res.redirect('/')
})

app.get('/secret', requireLogin, (req,res) => {
    res.send("you cannot see me unless logged in")
})

app.listen(3000, ()=>{
    console.log("listening");
})