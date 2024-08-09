const mongoose = require('mongoose')

module.exports.LikeCommentSchemas = mongoose.Schema({
    user_id:{
        type: mongoose.Types.ObjectId,
        require: true,
        ref:"User"
    },
    comment_id:{
        type: mongoose.Types.ObjectId,
        require: true,
        ref:"Comment"
    }
})