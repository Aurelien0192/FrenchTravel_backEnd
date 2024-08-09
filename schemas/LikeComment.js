const mongoose = require('mongoose')

const LikeCommentSchemas = mongoose.Schema({
    user_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        index: true,
        ref:"User"
    },
    comment_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        index: true,
        ref:"Comment"
    }
})

LikeCommentSchemas.index({user_id: 1, comment_id: 1},{unique: true})

module.exports.LikeCommentSchemas = LikeCommentSchemas

