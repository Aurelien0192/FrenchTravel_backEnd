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
    it("Add one place with missing property - E", (done) => {
        chai.request(server).post('/place').send(PlaceWithoutname).end((err, res) => {
            res.should.has.status(405)
            console.log(res.body)
            done()
        })
    })
})
