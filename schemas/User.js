const mongoose = require('mongoose')

UserSchema = mongoose.Schema({
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
    username:{
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
    token: String,
    profilePhoto :{
        type: mongoose.Types.ObjectId,
        ref:"Image",
        default:"66aa65e3841371a1955939dc"
    },
    create_at:{
        type:Date,
        default:new Date()
    }
})
module.exports.UserSchema = UserSchema