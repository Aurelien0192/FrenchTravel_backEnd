const { response } = require('express')
const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required: true,
        immutable: true
    },
    place_id:{
        type:mongoose.Types.ObjectId,
        ref:"Place",
        required: true,
        immutable: true,
    },
    isResponse:{
        type:Boolean,
        default: false,
    },
    comment:{
        type: String,
        required: true,
        index:true
    },
   like:{
        type: Number,
        required:true,
        default:0
    },
    response:{
        type: mongoose.Types.ObjectId,
        ref:"Comment"
    },
    note:{
        type: Number,
        min:1,
        max:5,
        required : true,
        immutable : true
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

CommentSchema.virtual('likes',{
    ref:"LikeComment",
    localField: '_id',
    foreignField:'comment_id'
})

module.exports.CommentSchema = CommentSchema