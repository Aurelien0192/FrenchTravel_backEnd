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
        chai.request(server).post('/place').send(placeWithWrongAdresse).auth(tokens[0],{type: 'bearer'}).end((err, res) => {
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
