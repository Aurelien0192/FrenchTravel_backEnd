const mongoose = require('mongoose')

module.exports.UserSchema = mongoose.Schema({
    firstName : {
        type : String,
        validate : [function validator(){
                return (!this.userType || this.userType==="user" || (this.userType === "professional" && this.firstName !==""))
            },{msg : `Le prénom est requis pour un compte professionnel`, type_error:"no-valid"}]
    },
    lastName : {
        type : String,
        validate : [function validator(){
                return (!this.userType || this.userType==="user" || (this.userType === "professional" && this.lastName !==""))
            },{msg : `Le nom est requis pour un compte professionnel`, type_error:"no-valid"}]
    },
    userType:{
        type: String,
        enum: ["professional","user","admin"],
        required:true,
        immutable: true
    },
    userName:{
        type: String,
        required: true,
        index:true,
        unique:true
    },
    password:{
        type: String,
        required: true 
    },
    email:{
        type:String,
        required : true,
        index:true,
        unique:true
    },
    about: String,
    create_at:{
        type:Date,
        default:new Date()
    }
})