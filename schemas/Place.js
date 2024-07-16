const mongoose = require('mongoose')

module.exports.PlaceSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId
    },
    categorie : {
        type: String,
        enum : ["hotel","restaurant","activity"],
        default:"activity",
        required: true
    },
    notation : Number,
    describe : {
        type : String,
        required : true
    },
    moreInfo : {
        schedules : {
            type : [Object],
            default:undefined,
            validate : [function validator(){
                return this.categorie === "activity"
            },{message : `schedules is not allowed in categorie hotel or restaurant`}]
            
        },
        duration : {
            type : String,
            validate : [function validator(){
                return this.categorie === "activity"
            },{message : `duration is not allowed in categorie hotel or restaurant`}]
        },
        price : {
            type : [Number],
            default:undefined,
            validate : [function validator(){
                return this.categorie === "restaurant"
            },{message : `price is not allowed in categorie hotel or activity`}]
        },
        diner : {
            type : String,
            validate : [function validator(){
                return this.categorie === "restaurant"
            },{message : `diner is not allowed in categorie hotel or activity`}]
        },
        cook :{
            type : String,
            validate : [function validator(){
                return this.categorie === "restaurant"
            },{message : `diner is not allowed in categorie hotel or activity`}]
        },
        services :{
            type : String,
            validate : [function validator(){
                return this.categorie === "restaurant" || this.categorie === "hotel"
            },{message : `services is not allowed in categorie activity`}]
        },
        equipment :{
            type : String,
            validate : [function validator(){
                return this.categorie === "hotel"
            },{message : `services is not allowed in categorie activity or restaurant`}]
        },
        accessibility :{
            type : [String],
            default:undefined,
            validate : [function validator(){
                return this.categorie === "hotel"
            },{message : `services is not allowed in categorie activity or restaurant`}]
        },
    },
    street:{
        type: String,
        required: true
    },
    city : {
        type : String,
        required: true
    },
    codePostal : {
        type : String,
        required : true
    },
    county :{
        type: String,
        required: true
    },
    country : {
        type : String,
        required: true
    },
    latCoordinate : {
        type : String,
        required: true
    },
    lonCoordinate : {
        type : String,
        required: true
    },
    phone : String,
    typeOfPlace : {
        type :[String],
        default:undefined
    },
    email : String,
    bookingLink : String,
})

