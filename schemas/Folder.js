const mongoose = require('mongoose')

const FolderSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    user :{
        type: mongoose.Types.ObjectId,
        required: true,
        immutable: true,
        ref: "User"
    },
})

FolderSchema.virtual('favorites',{
    ref:'Favorite',
    localField : '_id',
    foreignField:'folder'
})

module.exports.FolderSchema = FolderSchema