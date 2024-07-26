const chai = require('chai') 
const PlaceService = require("../../services/PlaceService").PlaceService;
const ImageService = require("../../services/ImageService").ImageService;
const { destination } = require('pino');
let expect = chai.expect


const placeGood = {
    name: "Château du Doubs",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "activity",
    moreInfo:{
        schedules: [
            "lundi : 9h - 18h",
            "mardi : 9h - 18h",
            "mercredi : 9h - 18h",
            "jeudi : 9h - 18h",
            "vendredi : 9h - 18h",
            "samedi : 9h - 18h",
            "dimanche : fermé"
        ],
        duration : 6,
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263"
}

const PlaceWithoutname = {
    describe : "Super chateau dans le centre du Doubs",
    categorie : "activity",
    moreInfo:{
        schedules: [
            "lundi : 9h - 18h",
            "mardi : 9h - 18h",
            "mercredi : 9h - 18h",
            "jeudi : 9h - 18h",
            "vendredi : 9h - 18h",
            "samedi : 9h - 18h",
            "dimanche : fermé"
        ],
        duration : 6
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263"
}

const PlaceMissingname = {
    name:"",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "activity",
    moreInfo:{
        schedules: [
            "lundi : 9h - 18h",
            "mardi : 9h - 18h",
            "mercredi : 9h - 18h",
            "jeudi : 9h - 18h",
            "vendredi : 9h - 18h",
            "samedi : 9h - 18h",
            "dimanche : fermé"
        ],
        duration : 6
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263"
}

const PlaceWithstringPrice = {
    name:"les Capucines",
    describe : "Super chateau dans le centre du Doubs",    
    categorie : "restaurant",
    moreInfo:{
        cook : "miam",
        sevices: "vraiment bon",
        price:["null", "null"]
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263"
}

const PlaceWithNullPrice = {
    name:"les Capucines",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "restaurant",
    moreInfo:{
        cook : "miam",
        sevices: "vraiment bon",
        price:[null, null]
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263"
}

const PlaceWithThreePrices = {
    name:"les Capucines",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "restaurant",
    moreInfo:{
        cook : "miam",
        sevices: "vraiment bon",
        price:[1, 2, 3]
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263"
}

const placeWithWrongInfoSup = {
    name: "Château du Doubs",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "activity",
    moreInfo:{
        services : "je fais même le café",
        duration : 6
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263"
}

const placeWithUnwantedProperty = {
    name: "Château du Doubs",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "restaurant",
    moreInfo:{
        cook: "lundi : 9h - 18h",
        price:[10,25]
    },
    street: "2 Pont de la République",
    city: "Besançon",
    codePostal : "25000",
    country: "France",
    county: "Doubs",
    latCoordinate: "47.2407913",
    lonCoordinate:"6.0280113",
    ElleEstOuLaPoulette: "Kammelot"
}

const restaurantWithWrongPrices = {
    name: "Château du Doubs",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "restaurant",
    moreInfo:{
        price :[25,10],
        cook: "lundi : 9h - 18h"
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263",
    ElleEstOuLaPoulette: "Kammelot"
}

const placeWithUncorrectType = {
    name: "Château du Doubs",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "activity",
    moreInfo:{
        schedules: [
            "lundi : 9h - 18h",
            "mardi : 9h - 18h",
            "mercredi : 9h - 18h",
            "jeudi : 9h - 18h",
            "vendredi : 9h - 18h",
            "samedi : 9h - 18h",
            "dimanche : fermé"
        ],
        duration : 6,
    },
    street: "2 rue du Moulin Parnet",
    city: {coucou:"c'est moi", test: ()=> {console.log("ok")}},
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263",
}

const placeNothingGood = {
    name: ["Château du Doubs"],
    categorie : "hello",
    moreInfo:{
        schedules: [
            "lundi : 9h - 18h",
            "mardi : 9h - 18h",
            "mercredi : 9h - 18h",
            "jeudi : 9h - 18h",
            "vendredi : 9h - 18h",
            "samedi : 9h - 18h",
            "dimanche : fermé"
        ],
        duration : 6,
    },
    street: "2 rue du Moulin Parnet",
    city: {coucou:"c'est moi", test: ()=> {console.log("ok")}},
    codePostal :'',
    country: "France",
    county: "Doubs",
    latCoordinate: "46.907258",
    lonCoordinate:"6.3537263",
}

let place = {}

describe("addOnePlace", () => {
    it("Correct Place. - S" ,(done) => {
        PlaceService.addOnePlace(placeGood,"669ea20a3078f5dda16855f0", null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(value['name']).to.be.equal("Château du Doubs")
            expect(err).to.be.null
            place = {...value}
            done()
        })
    })
    it("add image to correct place - S", (done) => {
        const images=[{
            fieldname: 'images',
            originalname: 'leCanyon.jpg',
            encoding:'7bit',
            mimetype:'image/jpeg',
            destination:'data/images',
            filename:'leCanyontadaaa.jpeg',
            path:"data\\images\\leCanyontadaaa.jpeg",
            size:716175
        },{
            fieldname: 'images',
            originalname: 'leCanyon2.jpg',
            encoding:'7bit',
            mimetype:'image/jpeg',
            destination:'data/images',
            filename:'leCanyontadaaa2.jpeg',
            path:"data\\images\\leCanyontadaaa2.jpeg",
            size:716175
        }]
        ImageService.addManyImages(images, place._id,"669ea20a3078f5dda16855f0", function(err, value){

            done()
        })
    })

    it("Place without Name - E", (done) => {
        PlaceService.addOnePlace(PlaceWithoutname,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("validator")
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place missing Name - E", (done) => {
        PlaceService.addOnePlace(PlaceMissingname,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('fields')
            expect(err['fields']).to.haveOwnProperty('name')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("validator")
            expect(value).to.be.undefined
            done()
        })
    })
    it("place with wrong info sup - E", (done) => {
        PlaceService.addOnePlace(placeWithWrongInfoSup,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("place with unwanted property - S",(done) => {
        PlaceService.addOnePlace(placeWithUnwantedProperty,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.not.have.property("ElleEstOuLaPoulette")
            expect(err).to.be.null
            done()
        })
    })
    it("place with wrong price - E",(done) => {
        PlaceService.addOnePlace(restaurantWithWrongPrices,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.an("object")
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Restaurant with string price - E",(done) => {
        PlaceService.addOnePlace(PlaceWithstringPrice,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Restaurant with null price - E",(done) => {
        PlaceService.addOnePlace(PlaceWithNullPrice,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(err).to.haveOwnProperty('fields_with_error')
            expect(err['fields_with_error']).to.be.includes('price1')
            expect(err['fields_with_error']).to.be.includes('price2')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Restaurant with three price - E",(done) => {
        PlaceService.addOnePlace(PlaceWithThreePrices,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(err).to.haveOwnProperty('fields_with_error')
            expect(err['fields_with_error']).to.be.includes('price1')
            expect(err['fields_with_error']).to.be.includes('price2')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place with uncorrect type - E",(done) => {
        PlaceService.addOnePlace(placeWithUncorrectType,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place with many error - E",(done) => {
        PlaceService.addOnePlace(placeNothingGood,"669ea20a3078f5dda16855f0", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place without object - E",(done) => {
        PlaceService.addOnePlace(null, null,"669ea20a3078f5dda16855f0", function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place with no user-id - E",(done) => {
        PlaceService.addOnePlace(placeGood, null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
})

describe("FindOnePlace",()=>{
    it("find one place with correct id -S ",(done) => {
        PlaceService.findOnePlaceById(place._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            console.log(value['_id'], place._id)
            //expect(value['_id']).be.equal(place._id)
            expect(err).to.be.null
            done()
        })
    })
    it("find one place with correct id with populate - S",(done) => {
        PlaceService.findOnePlaceById(place._id, {populate:true}, function(err, value){
            done()
        })
    })
    it("find random place - S",(done)=> {
        PlaceService.findManyPlaceRandom(function(err, value){
            done()
        })
    })
    it("return near places - S",(done) => {
        PlaceService.findPlacesNear(place.latCoordinate, place.lonCoordinate,function(err, value){
            done()
        })
    })
})