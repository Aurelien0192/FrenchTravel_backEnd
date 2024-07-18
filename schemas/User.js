const mongoose = require('mongoose')

module.exports.UserSchema = mongoose.Schema({
    firstName : {
        type : String,
        validate : [function validator(){
                return this.userType === "professionnal" && this.firstName !==""
            },{msg : `Le prénom est requis pour un compte professionnel`, type_error:"no-valid"}]
    },
    lastName : {
        type : String,
        validate : [function validator(){
                return this.userType === "professionnal" && this.firstName !==""
            },{msg : `Le prénom est requis pour un compte professionnel`, type_error:"no-valid"}]
    },
    userType:{
        type: String,
        enum: ["professional","user","admin"],
        required:true
    },
    username:{
        type:String,
        required: true,
        index:true,
        unique:true
    },
    password:{
        type: String,
        required: true 
    },
    email:{
        type:mongoose.Types.email,
        required : true,
        index:true,
        unique:true
    },
    about: String,
})