const mongoose = require('mongoose')
const Comment = require('./comment.model')
const Question = require('./question.model')
const {Schema} = mongoose
const bcrypt = require('bcryptjs');
passportLocalMongoose = require('passport-local-mongoose')

 const userSchema = new Schema({
    email:{
        type:String,
        required:[true, 'Username cannot be blank'],
        unique:true
    },
    comments: [{type: Schema.Types.ObjectId, ref:'Comment'}],
    questions: [{type: Schema.Types.ObjectId, ref:'Question'}]
 })

 userSchema.plugin(passportLocalMongoose)

//  userSchema.statics.findAndValidate = async function(username, password){
//    const foundUser =  await this.findOne({username})

//    const isValid =  await bcrypt.compare(password, foundUser.password)
//    return isValid ? foundUser : false;
//  }

 module.exports = mongoose.model('User', userSchema)