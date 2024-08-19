const mongoose = require('mongoose')

const FavoriteSchema = mongoose.Schema({
    user :{
        type: mongoose.Types.ObjectId,
        required: true
    },
    place:{
        type: mongoose.Types.ObjectId,
        required:true
    },
    folder:{
        type: mongoose.Types.ObjectId
    },
    visited:{
        type: Boolean,
        default: false
    }
})