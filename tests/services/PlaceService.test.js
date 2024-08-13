const chai = require('chai') 
const PlaceService = require("../../services/PlaceService").PlaceService;
const ImageService = require("../../services/ImageService").ImageService;
const UserService = require("../../services/UserService").UserService
const CommentService = require("../../services/CommentService").CommentServices
const LikeCommentService = require("../../services/LikeCommentService").LikeCommentService
const { destination } = require('pino');
let expect = chai.expect


const goodHotel = {
    name: "Château du Doubs",
    describe : "Super chateau dans le centre du Doubs",
    categorie : "hotel",
    moreInfo:{
        services:"ascensceur"
    },
    street: "2 rue du Moulin Parnet",
    city: "Pontarlier",
    codePostal : "25300",
    country: "France",
    county: "Doubs",
    latCoordinate: 46.907258,
    lonCoordinate:6.3537263
}

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
    latCoordinate: 46.907258,
    lonCoordinate:6.3537263
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
    latCoordinate: 46.907258,
    lonCoordinate:6.3537263
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
    latCoordinate: 46.907258,
    lonCoordinate:6.3537263
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
    latCoordinate: 46.907258,
    lonCoordinate:6.3537263
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
    latCoordinate: 46.907258,
    lonCoordinate: 6.3537263
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
    latCoordinate: 46.907258,
    lonCoordinate: 6.3537263
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
    latCoordinate: 46.907258,
    lonCoordinate: 6.3537263
}

const placeWithUnwantedProperty = {
    name: "les tortues",
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
    latCoordinate: 47.2407913,
    lonCoordinate: 6.0280113,
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
    latCoordinate: 46.907258,
    lonCoordinate: 6.3537263,
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
    latCoordinate: 46.907258,
    lonCoordinate: 6.3537263,
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
    latCoordinate: 46.907258,
    lonCoordinate: 6.3537263,
}

const places = []
let imagesTab = []
let user = {}
const comments = []
const likes = []

describe('create user for test',() => {
    const goodUser ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"professional",
        username:"EricLaDébrouille",
        password:"coucou",
        email:"eric.dupond@gmail.com"
    }
    it("user creation",(done)=>{
        UserService.addOneUser(goodUser, null, function(err, value){
            user = {...value}
            done()
        })
    })
})

describe("addOnePlace", () => {
    it("Correct Place. - S" ,(done) => {
        PlaceService.addOnePlace(placeGood,user._id, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(value['name']).to.be.equal("Château du Doubs")
            expect(err).to.be.null
            places.push(value)
            done()
        })
    })
    it("Add comment to correct Place - S",(done)=>{
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment(user._id,places[0]._id,goodComment, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("note")
            expect(value["note"]).to.be.equal(5)
            expect(err).to.be.null
            comments.push(value)
            done()
        })
    })
    it("Add like to a correct comment",(done)=>{
        LikeCommentService.addOneLikeOnComment(comments[0]._id,user._id, 0,null,function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("comment_id")
            expect(value).to.haveOwnProperty("user_id")
            expect(String(value["comment_id"])).to.be.equal(String(comments[0]._id))
            expect(String(value["user_id"])).to.be.equal(String(user._id))
            likes.push(value)
            done()
        })
    })
    it("Correct hotel. - S" ,(done) => {
        PlaceService.addOnePlace(goodHotel,user._id, null, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(value['name']).to.be.equal("Château du Doubs")
            places.push(value)
            expect(err).to.be.null
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
        ImageService.addManyImages(images, places[0]._id,user._id, function(err, value){
            imagesTab = [...value]
            done()
        })
    })

    it("add image to correct hotel - S", (done) => {
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
        ImageService.addManyImages(images, places[1]._id,user._id, function(err, value){
            imagesTab = [...imagesTab, ...value]
            done()
        })
    })

    it("Place without Name - E", (done) => {
        PlaceService.addOnePlace(PlaceWithoutname,user._id, null, function(err, value){
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
        PlaceService.addOnePlace(PlaceMissingname,user._id, null, function(err, value){
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
        PlaceService.addOnePlace(placeWithWrongInfoSup,user._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("place with unwanted property - S",(done) => {
        PlaceService.addOnePlace(placeWithUnwantedProperty,user._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.not.have.property("ElleEstOuLaPoulette")
            expect(err).to.be.null
            places.push(value)
            done()
        })
    })
    it("add image to place with unwanted property - S", (done) => {
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
        ImageService.addManyImages(images, places[2]._id,user._id, function(err, value){
            imagesTab = [...imagesTab, ...value]
            done()
        })
    })
    it("place with wrong price - E",(done) => {
        PlaceService.addOnePlace(restaurantWithWrongPrices,user._id, null, function(err, value){
            expect(err).to.be.an("object")
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Restaurant with string price - E",(done) => {
        PlaceService.addOnePlace(PlaceWithstringPrice,user._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Restaurant with null price - E",(done) => {
        PlaceService.addOnePlace(PlaceWithNullPrice,user._id, null, function(err, value){
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
        PlaceService.addOnePlace(PlaceWithThreePrices,user._id, null, function(err, value){
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
        PlaceService.addOnePlace(placeWithUncorrectType,user._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place with many error - E",(done) => {
        PlaceService.addOnePlace(placeNothingGood,user._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place without object - E",(done) => {
        PlaceService.addOnePlace(null, null,user._id, function(err, value){
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
        PlaceService.findOnePlaceById(places[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(String(value['_id'])).be.equal(String(places[0]._id))
            expect(err).to.be.null
            done()
        })
    })
    it("find one place with correct id with populate - S",(done) => {
        PlaceService.findOnePlaceById(places[0]._id, {populate:true}, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            places.push(value)
            done()
        })
    })
})

describe('FindManyPlaces',() => {
    it("find many places with correct informations search:Besançon - S", (done) =>{
        PlaceService.findManyPlaces(1,5,{search:"Besançon"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value.results).to.be.an("array")
            expect(value.results).to.be.lengthOf(1)
            expect(value.results[0]).to.be.a('object')
            expect(value.results[0]).to.haveOwnProperty('city')
            value.results.forEach((e) => {
                expect(String(e.city)).to.be.equal('Besançon')
            })
            done()
        })
    })
    it("find many places with correct informations search:Pontarlier and Category:activity - S", (done) =>{
        PlaceService.findManyPlaces(1,5,{search:"Pontarlier",categorie:"activity"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value.results).to.be.an("array")
            expect(value.results).to.be.lengthOf(1)
            expect(value.results[0]).to.be.a('object')
            expect(value.results[0]).to.haveOwnProperty('city')
            expect(value.results[0]).to.haveOwnProperty('categorie')
            value.results.forEach((e) => {
                expect(String(e.city)).to.be.equal('Pontarlier')
                expect(String(e.categorie)).to.be.equal('activity')
            })
            done()
        })
    })
    it("find many places with unexisting search - S", (done) =>{
        PlaceService.findManyPlaces(1,5,{search:"dsjogjqzjggz"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value.results).to.be.an("array")
            expect(value.results).to.be.lengthOf(0)
            done()
        })
    })
    it("find many places with supplementary info search:Besançon - S", (done) =>{
        PlaceService.findManyPlaces(1,5,{search:"Besançon",coucou:"coucou"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value.results).to.be.an("array")
            expect(value.results).to.be.lengthOf(1)
            expect(value.results[0]).to.be.a('object')
            expect(value.results[0]).to.haveOwnProperty('city')
            value.results.forEach((e) => {
                expect(String(e.city)).to.be.equal('Besançon')
            })
            done()
        })
    })
    it("find many places with null page and limit - S", (done) =>{
        PlaceService.findManyPlaces(null, null,{search:"Besançon"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value.results).to.be.an("array")
            expect(value.results).to.be.lengthOf(1)
            expect(value.results[0]).to.be.a('object')
            expect(value.results[0]).to.haveOwnProperty('city')
            value.results.forEach((e) => {
                expect(String(e.city)).to.be.equal('Besançon')
            })
            done()
        })
    })
})

describe("findManyPlaceRandom",() => {
    it("find random place - S",(done)=> {
        PlaceService.findThreePlacesPerCategoryWithBestNotation(function(err, value){            
            // expect(value).to.be.an('array')
            // expect(value[0]).to.be.a('object')
            // expect(value[0]).to.haveOwnProperty('images')
            // expect(value[0].images).to.be.an('array')
            // expect(err).to.be.null
            done()
        })
    })
})

describe("findNearPlaces",()=>{
    it("return near places - S",(done) => {
        PlaceService.findPlacesNear(places[0].latCoordinate, places[0].lonCoordinate,function(err, value){
            expect(value).to.be.an('array')
            expect(value).to.have.lengthOf.below(31)
            value.forEach(place => {
                expect(place).to.haveOwnProperty('city')
                expect(place['city']).to.be.equal("Pontarlier")
            });
            done()
        })
    })
    it("return near places with wrong coordinate - E",(done) => {
        PlaceService.findPlacesNear("jsdvoiqjod", places[0].lonCoordinate,function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it("return near places with missing coordinate - E",(done) => {
        PlaceService.findPlacesNear(null, null,function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
})

describe("deleteOnePlace",() => {
    it("delete on place with missing ID - E",(done) => {
        PlaceService.deleteOnePlace(null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete on place with uncorrect ID - E",(done) => {
        PlaceService.deleteOnePlace("fsfeojfe", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete on place with correct ID but not exist - E",(done) => {
        PlaceService.deleteOnePlace(user._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it("delete on place with correct ID - S",(done) => {
        PlaceService.deleteOnePlace(places[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(String(value['_id'])).to.be.equal(String(places[0]._id))
            places.splice(0,1)
            done()
        })
    })
    it("check comment is deleting - S",(done) => {
        CommentService.findOneCommentById(comments[0]._id,null, function(err, value){
            expect(err).to.be.a("object")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-found")
            done()
        })
    })
    it("check like of comment is deleting - S",(done)=>{
        LikeCommentService.findOneLikeCommentById(likes[0]._id,null, function(err, value){
            expect(err).to.be.a("object")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-found")
            done()
        })
    })
    it("verify images deleting - S",(done) => {
        ImageService.findOneImageById(imagesTab[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err['type_error']).to.be.equal('no-found')
        })
        ImageService.findOneImageById(imagesTab[1]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err['type_error']).to.be.equal('no-found')
        })
        imagesTab.splice(0,2)
        done()
    })
})

describe("deleteManyPlaces",()=>{
    it("delete many places with not array - E",(done)=>{
        PlaceService.deleteManyPlaces(user._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-valid")
            done()
        })
    })
    it("delete many places with correct ID but not exist - E",(done)=>{
        PlaceService.deleteManyPlaces([user._id,"66a0cee18af9a80e789f14cc"], null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-found")
            done()
        })
    })
    it("delete many places with uncorrect IDs - E",(done)=>{
        PlaceService.deleteManyPlaces(["geqjlgqr","dlqjgio"], null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-valid")
            done()
        })
    })
    it("delete many places empty array - E",(done)=>{
        PlaceService.deleteManyPlaces([], null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-valid")
            done()
        })
    })
    it("delete many places missing array - E",(done)=>{
        PlaceService.deleteManyPlaces(null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-valid")
            done()
        })
    })
    it("delete many places with correct ID - S",(done)=>{
        PlaceService.deleteManyPlaces(places.map((place)=>{return place._id}), null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("deletedCount")
            expect(value['deletedCount']).to.be.equal(2)
            done()
        })
    })
    it("verify images deleting - S",(done) => {
        ImageService.findOneImageById(imagesTab[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err['type_error']).to.be.equal('no-found')
        })
        ImageService.findOneImageById(imagesTab[1]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err['type_error']).to.be.equal('no-found')
        })
        ImageService.findOneImageById(imagesTab[2]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err['type_error']).to.be.equal('no-found')
        })
        ImageService.findOneImageById(imagesTab[3]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err['type_error']).to.be.equal('no-found')
        })
        done()
    })
})
describe("delete user",() => {
    it("delete",(done)=>{
        UserService.deleteOneUser(user._id, null, function(err, value){
            done()
        })
    })
})