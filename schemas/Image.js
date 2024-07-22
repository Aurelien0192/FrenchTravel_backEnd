const mongoose = require('mongoose')

module.exports.ImageSchema = mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    place:{
        type: mongoose.Types.ObjectId,
        required : true
    },
    user_owner:{
        type: mongoose.Types.ObjectId,
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