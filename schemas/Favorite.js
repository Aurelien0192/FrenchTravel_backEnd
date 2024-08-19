const mongoose = require('mongoose')

const FavoriteSchema = mongoose.Schema({
    user :{
        type: mongoose.Types.ObjectId,
        required: true,
        ref:"User",
        immutable: true
    },
    place:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:"Place",
        immutable: true
    },
    folder:{
        type: mongoose.Types.ObjectId,
        ref:"Folder"
    },
    visited:{
        type: Boolean,
        default: false
    }
})