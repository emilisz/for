const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model");
const Comment = require("./models/comment.model");
const Question = require("./models/question.model");
const passport = require("passport");
const LocalStrategy = require("passport-local");

main(console.log("mongo connection open")).catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/forum");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "forum",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.message = req.flash("success");
  res.locals.errmsg = req.flash("error");
  next();
});

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you need to log in first");
    return res.redirect("/login");
  }
  next();
};

app.get("/", async (req, res) => {
  const questions = await Question.find({}).populate("comments").populate("user");
  res.render("index", { questions });
});

app.get("/questions/create", isLoggedIn, async (req, res) => {
  res.render("questions/create");
});

app.post("/questions", isLoggedIn, async (req, res) => {
  const q = new Question(req.body);
  q.user = req.user;
  await q.save();
  res.redirect("/");
});

app.get("/questions/:id", async (req, res) => {
  const { id } = req.params;
  const question = await Question.findById(id).populate({
    path: "comments",
    populate: { path: "user" },
  });
  console.log(question);
  res.render("questions/show", { question });
});

app.post("/questions/:id/comments", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const comment = new Comment({ title });
    const question = await Question.findById(id);
    question.comments.push(comment);
    comment.question = question;
    comment.user = req.user;
    await comment.save();
    await question.save();
    res.redirect("/questions/" + id);
  } catch (error) {
    req.flash("error", error.errors.title.message);
  }
});

// auth routes ====================================================
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
  req.flash("success", "welcome to the forum app");
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const { password, username, email } = req.body;

    const user = new User({
      username,
      email,
    });

    const registeredUser = await User.register(user, password);
    console.log(registeredUser);
    req.flash("success", "Welcome to forum app!");
    res.redirect("/");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
});

app.post("/logout", isLoggedIn, (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "goodbye!");
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("listening");
});
