const mongoose = require('mongoose')
const Comment = require('./comment.model')
const User = require('./user.model')
const {Schema} = mongoose

 const questionSchema = new Schema({
    title:{
        type:String,
        required:[true, 'question cannot be blank']
    },
    user: {type: Schema.Types.ObjectId, ref:'User'},
    comments: [{type: Schema.Types.ObjectId, ref:'Comment'}]
 }, { timestamps: true })

//  questionSchema.post('findOneAndDelete', async function(question){
//     if (question.comments.length) {
//      await Comment.deleteMany({_id: {$in :question.comments}})
//     }
//    })

 module.exports = mongoose.model('Question', questionSchema)