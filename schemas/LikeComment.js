const mongoose = require('mongoose')

const LikeCommentSchemas = mongoose.Schema({
    user_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        index: true,
        ref:"User",
        immutable: true
    },
    comment_id:{
        type: mongoose.Types.ObjectId,
        required: true,
        index: true,
        ref:"Comment",
        immutable: true,
    },
    create_at:{
        type:Date,
        default:new Date()
    },
})

LikeCommentSchemas.index({user_id: 1, comment_id: 1},{unique: true})

module.exports.LikeCommentSchemas = LikeCommentSchemas

