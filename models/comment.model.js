const mongoose = require('mongoose')
const Question = require('./question.model')
const User = require('./user.model')
const {Schema} = mongoose

 const commentSchema = new Schema({
    title:{
        type:String,
        required:[true, 'comment cannot be blank']
    },
    user: {type: Schema.Types.ObjectId, ref:'User'},
    question: {type: Schema.Types.ObjectId, ref:'Question'},
 }, { timestamps: true })



 module.exports = mongoose.model('Comment', commentSchema)