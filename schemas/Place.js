const mongoose = require('mongoose')

const PlaceSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true
    },
    categorie : {
        type: String,
        enum : ["hotel","restaurant","activity"],
        default:"activity",
        required: true,
        immutable:true
    },
    notation :{
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    numberOfNote:{
        type: Number,
        default: 0,
        min: 0
    },
    describe : {
        type : String,
        required : true
    },
    moreInfo : {
        schedules : {
            type : [Object],
            default:undefined,
            validate : [function validator(){
                return this.categorie === "activity" || (this._update.$set.categorie === "activity")
            },{message : `schedules is not allowed in categorie hotel or restaurant`}]
            
        },
        duration : {
            type : String,
            validate : [function validator(){
                return this.categorie === "activity" || (this._update.$set.categorie === "activity")
            },{message : `duration is not allowed in categorie hotel or restaurant`}]
        },
        price : {
            type : [Number],
            default:undefined,
            validate : [
                {validator : function validator(){
                    return this.categorie === "restaurant" || (this._update.$set.categorie === "restaurant")
                },message : `price is not allowed in categorie hotel or activity`},
                {validator : function lengh(price){
                    return (price.length === 2 || price.lengh===0);
                },message: "price cannot take more than two values"},
                {validator : function lengh(price){
                    return (price[0] !== null && price[1]!== null);
                },message: "Les prix renseignées doivent être un nombre"}
            ]
        },
        diner : {
            type : String,
            validate : [function validator(){
                return this.categorie === "restaurant" || (this._update.$set.categorie === "restaurant")
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
                return (this.categorie === "restaurant" || this.categorie === "hotel") || (this._update.$set.categorie === "hotel"|| this._update.$set.categorie === "restaurant")
            },{message : `services is not allowed in categorie activity`}]
        },
        equipment :{
            type : String,
            validate : [function validator(){
                return this.categorie === "hotel" || this._update.$set.categorie === "hotel"
            },{message : `services is not allowed in categorie activity or restaurant`}]
        },
        hotelCategorie:{
            type:Number,
            min:1,
            max:5,
            validate : [function validator(){
                return this.categorie==="hotel" || this._update.$set.categorie === "hotel"
            },{message : `duration is not allowed in categorie activity or restaurant`}]
        },
        accessibility :{
            type : [String],
            default:undefined,
            validate : [function validator(){
                return this.categorie === "hotel" || this._update.$set.categorie === "hotel"
            },{message : `services is not allowed in categorie activity or restaurant`}]
        },
    },
    street:{
        type: String,
        required: true
    },
    city : {
        type : String,
        required: true,
        match: /^[a-zA-ZÀ-ÿ' -]+(?: [a-zA-ZÀ-ÿ' -]+)*$/
    },
    codePostal : {
        type : String,
        required : true,
        match: /^\d{5}$/
    },
    county :{
        type: String,
        required: true,
        match: /^[a-zA-ZÀ-ÿ' -]+(?: [a-zA-ZÀ-ÿ' -]+)*$/
    },
    country : {
        type : String,
        required: true,
        match: /^[a-zA-ZÀ-ÿ' -]+(?: [a-zA-ZÀ-ÿ' -]+)*$/
    },
    latCoordinate : {
        type : Number,
        required: true,
        match: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/
    },
    lonCoordinate : {
        type : Number,
        required: true,
        match: /^[-+]?((1[0-7]\d|\d{1,2})(\.\d+)?|180(\.0+)?)$/
    },
    phone : {
        type:String,
        match :/^(?:0[1-9](?:\.\d{2}){4}|\+33\.[1-9](?:\.\d{2}){4})$/
    },
    typeOfPlace : {
        type :[String],
        default:undefined
    },
    email :{
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    bookingLink : String,
    create_at:{
        type:Date,
        default: new Date()
    },
    update_at: Date
})

PlaceSchema.virtual('images',{
    ref:'Image',
    localField : '_id',
    foreignField:'place'
})

module.exports.PlaceSchema = PlaceSchema