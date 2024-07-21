const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require('./../../server')

chai.use(chaiHttp)

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
    county: "Doubs"
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
    county: "Doubs"
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
    county: "Doubs"
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
    county: "Doubs"
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
    county: "Doubs"
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
    county: "Doubs"
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
    county: "Doubs"
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
    ElleEstOuLaPoulette: "Kammelot"
}

const placeWithUncorrectType = {
    name: "Château du Doubs",
    describe : {coucou:"c'est moi", test: ()=> {console.log("ok")}},
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
    county: "Doubs"
}

const placeWithWrongAdresse = {
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
    street: "lalala",
    city: "lalala",
    codePostal :'',
    country: "France",
    county: "lalala"
}

describe("POST - /place", () => {
    it("Add one place good - S", (done) => {
        chai.request(server).post('/place').send(placeGood).end((err, res) => {
            expect(res.body).to.be.a('object')
            expect(res.body).to.be.haveOwnProperty('_id')
            res.should.has.status(201)
            expect(err).to.be.null
            done()
        })
    })
    it("Add one place without property - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithoutname).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one place with missing property - E", (done) => {
        chai.request(server).post('/place').send(PlaceMissingname).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with string prices - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithstringPrice).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with null prices - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithNullPrice).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with three prices - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithThreePrices).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with wrong info sup - E", (done) => {
        chai.request(server).post('/place').send(placeWithWrongInfoSup).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with unwanted property - S", (done) => {
        chai.request(server).post('/place').send(placeWithUnwantedProperty).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("Add one restaurant with unwanted property - S", (done) => {
        chai.request(server).post('/place').send(placeWithUnwantedProperty).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("Add one restaurant with wrong type in describe - E", (done) => {
        chai.request(server).post('/place').send(placeWithUncorrectType).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with wrong adress - E", (done) => {
        chai.request(server).post('/place').send(placeWithWrongAdresse).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
})
