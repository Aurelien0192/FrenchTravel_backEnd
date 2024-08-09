const mongoose = require('mongoose')

module.exports.CommentSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required: true
    },
    place_id:{
        type:mongoose.Types.ObjectId,
        ref:"Place",
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    like:{
        type: Number,
        default:0
    },
    note:{
        type: Number,
        min:1,
        max:5,
        required : true
    },
    dateVisited:{
        type: Date,
        required: true
    },
    create_at:{
        type: Date,
        default: new Date()
    },
    update_at:{
        type: Date,
    }
    
})

Comment.virtual('likes',{
    ref:"LikeComment",
    localField: '_id',
    foreignField:'comment_id'
})