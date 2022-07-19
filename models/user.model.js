const mongoose = require('mongoose')
const Comment = require('./comment.model')
const Question = require('./question.model')
const {Schema} = mongoose
const bcrypt = require('bcryptjs');

 const userSchema = new Schema({
    username:{
        type:String,
        required:[true, 'Username cannot be blank']
    },
    password:{
        type:String,
        required:[true, 'Password cannot be blank']
    },
    comments: [{type: Schema.Types.ObjectId, ref:'Comment'}],
    questions: [{type: Schema.Types.ObjectId, ref:'Question'}]
 })

 userSchema.statics.findAndValidate = async function(username, password){
   const foundUser =  await this.findOne({username})

   const isValid =  await bcrypt.compare(password, foundUser.password)
   return isValid ? foundUser : false;
 }

 module.exports = mongoose.model('User', userSchema)