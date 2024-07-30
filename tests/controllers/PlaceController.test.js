const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require('./../../server')

chai.use(chaiHttp)

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

let place = {}

const users = []
const tokens =[]

describe("POST - /place", () => {
    it ("create professional user -S", (done) => {
        chai.request(server).post('/user').send({
            firstName : "Eric",
            lastName : "Dupond",
            userType:"professional",
            username:"EricLaDébrouille",
            password:"coucou",
            email:"eric.dupond@gmail.com"
        }).end((err, res) =>{
            res.should.has.status(201)
            users.push(res.body)
            done()
        })
    })
    it ("create normal user -S", (done) => {
        chai.request(server).post('/user').send({
            firstName : "Eric",
            lastName : "Dupont",
            userType:"user",
            username:"EricLaFripouille",
            password:"coucou",
            email:"eric.dupont@gmail.com"
        }).end((err, res) =>{
            users.push(res.body)
            res.should.has.status(201)
            done()
        })
    })
    it("connect the professional user - S",(done) => {
        chai.request(server).post('/login').send({
            username:"EricLaDébrouille",
            password:"coucou"
        }).end((err, res) => {
            res.should.has.status(200)
            tokens.push(res.body.token)
            done()
        })
    })
    it("connect the normal user - S",(done) => {
        chai.request(server).post('/login').send({
            username:"EricLaFripouille",
            password:"coucou"
        }).end((err, res) => {
            res.should.has.status(200)
            tokens.push(res.body.token)
            done()
        })
    })
    it("Add one place good - S", (done) => {
        chai.request(server).post('/place').send(placeGood).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            expect(res.body).to.be.a('object')
            expect(res.body).to.be.haveOwnProperty('_id')
            res.should.has.status(201)
            place = {...res.body}
            expect(err).to.be.null
            done()
        })
    })
    it("Add one place without property - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithoutname).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one place with missing property - E", (done) => {
        chai.request(server).post('/place').send(PlaceMissingname).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with string prices - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithstringPrice).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with null prices - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithNullPrice).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with three prices - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithThreePrices).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with wrong info sup - E", (done) => {
        chai.request(server).post('/place').send(placeWithWrongInfoSup).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with unwanted property - S", (done) => {
        chai.request(server).post('/place').send(placeWithUnwantedProperty).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("Add one restaurant with unwanted property - S", (done) => {
        chai.request(server).post('/place').send(placeWithUnwantedProperty).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(201)
            done()
        })
    })
    it("Add one restaurant with wrong type in describe - E", (done) => {
        chai.request(server).post('/place').send(placeWithUncorrectType).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(405)
            done()
        })
    })
    it("Add one restaurant with wrong adress - E", (done) => {
        chai.request(server).post('/place').send(restaurantWithWrongPrices).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("Add good place with normal users - E", (done) => {
        chai.request(server).post('/place').send(placeGood).auth(tokens[1],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("Add good place with wrong token - E", (done) => {
        chai.request(server).post('/place').send(placeGood).auth("dsngblkqsd,bùdfh5fd6bhsh;fl,sh",{type: 'bearer'}).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("Add good place without token - E", (done) => {
        chai.request(server).post('/place').send(placeGood).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it('purge database - S',(done)=>{
        users.forEach((user) => {
                chai.request(server).delete(`/user/${user._id}`).end((err,res)=>{
            })
        })
    done()
    })
})
describe("GET - /place/:id",() =>{
    it('find place with correct ID - S', (done) => {
        chai.request(server).get(`/place/${place._id}`).end((err, res) =>{
            res.should.has.status(200)
            done()
        })
    })
    it('find place with uncorrect ID - E', (done) => {
        chai.request(server).get(`/place/${users[0]._id}`).end((err, res) =>{
            res.should.has.status(404)
            done()
        })
    })
    it('find place with wrong format ID - E', (done) => {
        chai.request(server).get(`/place/erghr`).end((err, res) =>{
            res.should.has.status(405)
            done()
        })
    })
    it('find place with missing ID - E', (done) => {
        chai.request(server).get(`/place/${null}`).end((err, res) =>{
            res.should.has.status(405)
            done()
        })
    })
})
describe('GET - /places/random', () =>{
    it('get random place',(done) => {
        chai.request(server).get(`/places/random`).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe('GET - /places', () => {
    it('get places with correct query - S',(done) => {
        chai.request(server).get('/places').query({search:"Besançon", page:1, limit:5}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it('get places with correct query with categorie - S',(done) => {
        chai.request(server).get('/places').query({search:"Pontarlier", categorie:"", page:1, limit:5}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it('get places with uncorrect search - S',(done) => {
        chai.request(server).get('/places').query({search:"zedzedzef", categorie:"", page:1, limit:5}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it('get places with missing query - S',(done) => {
        chai.request(server).get('/places').end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})

describe('GET - /places/suggestions', () => {
    it('get random place with correct coordinates - S',(done) => {
        chai.request(server).get('/places/suggestions').query({
            latCoordinate:place.latCoordinate,
            lonCoordinate : place.lonCoordinate
        }).end((err, res) =>{
            res.should.has.status(200)
            done()
        })
    })
    it('get random place with uncorrect coordinates - E',(done) => {
        chai.request(server).get('/places/suggestions').query({
            latCoordinate:place.latCoordinate,
            lonCoordinate : "gzagrezg"
        }).end((err, res) =>{
            res.should.has.status(405)
            done()
        })
    })
    it('get random place with missing query - E',(done) => {
        chai.request(server).get('/places/suggestions').end((err, res) =>{
            res.should.has.status(405)
            done()
        })
    })
})