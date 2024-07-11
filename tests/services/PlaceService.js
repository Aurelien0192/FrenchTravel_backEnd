const chai = require('chai') 
const PlaceService = require("../../services/PlaceService").PlaceService;
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


describe("addOnePlace", () => {
    it("Correct Place. - S" ,(done) => {

        PlaceService.addOnePlace(placeGood, function (err, value) {
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(value['name']).to.be.equal("Château du Doubs")
            expect(err).to.be.null
            done()
        })
    })
    it("Place without Name - E", (done) => {
        PlaceService.addOnePlace(PlaceWithoutname, function(err, value){
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
        PlaceService.addOnePlace(PlaceMissingname, function(err, value){
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
        PlaceService.addOnePlace(placeWithWrongInfoSup, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("place with unwanted property - S",(done) => {
        PlaceService.addOnePlace(placeWithUnwantedProperty, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(value).to.not.have.property("ElleEstOuLaPoulette")
            expect(err).to.be.null
            done()
        })
    })
    it("Place with uncorrect type - E",(done) => {
        PlaceService.addOnePlace(placeWithUncorrectType, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place with many error - E",(done) => {
        PlaceService.addOnePlace(placeNothingGood,function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Place without object - E",(done) => {
        PlaceService.addOnePlace(null,function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
    
})