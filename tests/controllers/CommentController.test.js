const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require('./../../server')

chai.use(chaiHttp)

const user = []
let place = {}
let token = ""

describe("post and login correct user",()=>{
    it("add one user for test - S",(done)=>{
        chai.request(server).post('/user').send({
            firstName : "Eric",
            lastName : "Dupond",
            userType:"professional",
            username:"EricLaDébrouille",
            password:"coucou",
            email:"eric.dupond@gmail.com"
        }).end((err, res)=>{
            res.should.has.status(201)
            user.push(res.body)
            done()
        })
    })
    it("login correct user",(done)=>{
        chai.request(server).post('/login').send({
            username:"EricLaDébrouille",
            password:"coucou"
        }).end((err,res)=>{
            res.should.has.status(200)
            token = res.body.token
            done()
        })
    })
    it("create a good place",(done) => {
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
        }
        chai.request(server).post('/place').send(goodHotel).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(201)
            place = {...res.body}
            done()
        })
    })
})
describe("/POST - addOneComment",() => {
    it("add correct comment to a good place with correct user - S",(done) => {
        chai.request(server).post('/comment').auth(token,{type: 'bearer'}).query({place_id:place._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:4,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(201)
            done()
        })
    })
    it("add correct comment to a uncorrect ID place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(token,{type: 'bearer'}).query({place_id:"66b0658a72ec"}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add correct comment to a missing ID place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(token,{type: 'bearer'}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add correct comment to a good place with user not authentifiate - E",(done) => {
        chai.request(server).post('/comment').query({place_id:place._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it("add comment missing comment property to a good place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(token,{type: 'bearer'}).query({place_id:place._id}).send({
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add comment with string in note to a good place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(token,{type: 'bearer'}).query({place_id:place._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:"dvjvovjeio",
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add comment with note above of max to a good place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(token,{type: 'bearer'}).query({place_id:place._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:10,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add correct comment to a good place with correct user but second post - E",(done) => {
        chai.request(server).post('/comment').auth(token,{type: 'bearer'}).query({place_id:place._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
})

describe("deleteTheUser",() => {
    it("delete user - S",(done) => {
        chai.request(server).delete(`/user/${user[0]._id}`).auth(token,{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(200)
            done()
        })
    })
})