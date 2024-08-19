const mongoose = require('mongoose')

module.exports.ImageSchema = mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    place:{
        type: mongoose.Types.ObjectId,
        ref:"Place",
        immutable: true
    },
    user_id:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required : true,
        immutable: true
    },
    path:{
        type: String,
        required : true
    },
    create_at:{
        type: Date,
        default: new Date()
    }
    
})