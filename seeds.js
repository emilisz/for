const mongoose = require("mongoose");
const User = require('./models/user.model')
const Comment = require("./models/comment.model");
const Question = require("./models/question.model");

main(console.log("mongo connection open")).catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://localhost:27017/forum");
}

    const u = new User({username:'Dildo', password:'beggins 5, mordor'})
    u.save()

    const arr = [
        { title: "How to align divs", user: u }, 
        { title: "Granate is best cooked?",user: u  }, 
        { title: "How to make seeder in node js?", user: u }, 
        { title: "Boiled or raw?", user: u }, 
    ];
   
    arr.forEach(element =>  {
       const question = new Question(element)
       question.owner = u
       question.save()
    });

    // const commentsArr = [
    //     { title: "Not all in one place", user: u, question: Question.findOne().skip(randomIntFromInterval(1, 3)) }, 
    //     { title: "Good question",user: u, question: Question.findOne().skip(randomIntFromInterval(1, 3))  }, 
    //     { title: "Check above", user: u, question: Question.findOne().skip(randomIntFromInterval(1, 3)) }, 
    //     { title: "Why do you need answer", user: u, question: Question.findOne().skip(randomIntFromInterval(1, 3)) }, 
    // ];
   
    // commentsArr.forEach(element =>  {
    //    const question = new Comment(element)
    //    question.owner = u
    //    question.save()
    // });

    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
      }
      


