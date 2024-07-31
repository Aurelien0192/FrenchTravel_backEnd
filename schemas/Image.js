const mongoose = require('mongoose')

module.exports.ImageSchema = mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    place:{
        type: mongoose.Types.ObjectId,
        ref:"Place",
    },
    user_id:{
        type: mongoose.Types.ObjectId,
        ref:"User",
        required : true
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