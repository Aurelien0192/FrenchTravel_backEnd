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

let user = {}
let token = ""

describe("log a User -", () => {
    it("create an user",(done) =>{
        chai.request(server).post('/user').send({
            userType:"user",
            username:"titi",
            password:"123",
            email:"titi@gmail.com"
        }).end((err, res) =>{
            res.should.has.status(201)
            user = {...res.body}
            done()
        })
    })
    it("log the user",(done) => {
        chai.request(server).post('/login').send({
            username:"titi",
            password:"123"
        }).end((err, res) => {
            res.should.has.status(200)
            token= res.body.token
            done()
        })
    })
})
describe("GET - /Getlocation", () => {
    it("get location with empty query - S", (done) => {
        chai.request(server).get('/getlocation').auth(token,{type: 'bearer'}).send({}).end((err,res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("get locations with correct query - S", (done) => {
        chai.request(server).get('/getlocation').auth(token,{type: 'bearer'}).send(goodParams).end((err, res) => {
            expect(res.body).to.be.a('array')
            expect(res.body[0]).to.be.haveOwnProperty('display_name')
            expect(res.body[0]['display_name']).include('Exincourt')
            res.should.has.status(200)
            expect(err).to.be.null
            done()
        })
    })
    it("get locations with correct query but not connected - E", (done) => {
        chai.request(server).get('/getlocation').send(goodParams).end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
    it("get location with wrong query - E", (done) => {
        chai.request(server).get('/getlocation').auth(token,{type: 'bearer'}).send(wrongParams).end((err,res) => {
            res.should.has.status(404)
            done()
        })
    })
    it("get location with wrong query properties - S", (done) => {
        chai.request(server).get('/getlocation').auth(token,{type: 'bearer'}).send(wrongParamsProperty).end((err,res) => {
            res.should.has.status(404)
            done()
        })
    })
})
describe("delete User",() => {
    it("deleting the user -S",(done)=>{
        chai.request(server).delete(`/user/${user._id}`).auth(token,{type: 'bearer'}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
})