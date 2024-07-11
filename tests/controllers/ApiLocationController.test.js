const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require('./../../server')

chai.use(chaiHttp)

const goodParams = {
    street : "52+rue+cuvier",
    city : "Exincourt",
    postalCode : 25400
}

const wrongParams = {
    street : "la vie est faite de petites choses",
    city : "Lune",
    postalCode : 25400
}

const wrongParamsProperty = {
    Finlande : "52+rue+cuvier",
    Canada : "Exincourt",
    Paris : 25400
}

describe("GET - /Getlocation", () => {
    it("get location with empty query - S", (done) => {
        chai.request(server).get('/getlocation').query({}).end((err,res) => {
            res.should.has.status(200)
            done()
        })
    })
    it("get locations with correct query - S", (done) => {
        chai.request(server).get('/getlocation').query(goodParams).end((err, res) => {
            expect(res.body).to.be.a('array')
            expect(res.body[0]).to.be.haveOwnProperty('display_name')
            expect(res.body[0]['display_name']).include('Exincourt')
            res.should.has.status(200)
            expect(err).to.be.null
            done()
        })
    })
    it("get location with wrong query - E", (done) => {
        chai.request(server).get('/getlocation').query(wrongParams).end((err,res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("get location with wrong query properties - S", (done) => {
        chai.request(server).get('/getlocation').query(wrongParamsProperty).end((err,res) => {
            res.should.has.status(200)
            expect(res.body).to.be.a('array')
            expect(res.body[0]).to.haveOwnProperty('place_id')
            /expect(res.body[0]['place_id']).to.be.equal(265731023)
            done()
        })
    })
})