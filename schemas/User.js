const mongoose = require('mongoose')

module.exports.UserSchema = mongoose.Schema({
    firstName : {
        type : String
    },
    lastName : {
        type : String
    },
    userType:{
        type: String,
        enum: ["professional","user","admin"],
        required:true
    },
    username:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true 
    },
    email:{
        type:mongoose.Types.email,
        required : true
    },
    about: String,
})