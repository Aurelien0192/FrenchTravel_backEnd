const mongoose = require('mongoose')

const FolderSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    user :{
        type: mongoose.Types.ObjectId,
        required: true
    },
    place:{
        type: mongoose.Types.ObjectId,
        required:true
    }
})