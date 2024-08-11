const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require('./../../server')
const passport = require('passport')
const LikeCommentService = require("../../services/LikeCommentService").LikeCommentService

chai.use(chaiHttp)

const users = []
let places = []
let comments = []
const like = []
const token = []

describe("POST - /User",()=>{
    it("add correct users - S",(done) => {
        chai.request(server).post('/user').send({
            firstName : "Eric",
            lastName : "Dupond",
            userType:"professional",
            username:"EricLaDébrouille",
            password:"coucou",
            email:"eric.dupond@gmail.com"
        }).end((err, res)=>{
            res.should.has.status(201)
            users.push(res.body)
            done()
        })
    })
    it("login correct user",(done)=>{
         chai.request(server).post('/login').send({
            username:"EricLaDébrouille",
            password:"coucou"
        }).end((err, res) => {
            res.should.has.status(200)
            token.push(res.body.token)
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
            latCoordinate: 46.907258,
            lonCoordinate:6.3537263
        }
        chai.request(server).post('/place').send(goodHotel).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(201)
            places.push(res.body)
            done()
        })
    })
    it("create another good place",(done) => {
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
        chai.request(server).post('/place').send(placeWithUnwantedProperty).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(201)
            places.push(res.body)
            done()
        })
    })
    it("create a good comment",(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }
        chai.request(server).post('/comment').query({place_id : places[0]._id}).auth(token[0],{type: 'bearer'}).send(goodComment).end((err, res) => {
            res.should.has.status(201)
            comments.push(res.body)
            done()
        })
    })
    it("create another good comment - S",(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }
        chai.request(server).post('/comment').query({place_id : places[1]._id}).auth(token[0],{type: 'bearer'}).send(goodComment).end((err, res) => {
            res.should.has.status(201)
            comments.push(res.body)
            done()
        })
    })
    it("add a like to a comment one - S",(done)=>{
        chai.request(server).post("/like").query({comment_id:comments[0]._id}).auth(token[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(201)
            like.push(res.body)
            done()
        })
    })
    it("add a like to a comment two - S",(done)=>{
        chai.request(server).post("/like").query({comment_id:comments[1]._id}).auth(token[0],{type: 'bearer'}).end((err, res) => {
            res.should.has.status(201)
            like.push(res.body)
            done()
        })
    })
    it("add correct users with minimal property - S",(done) => {
        chai.request(server).post('/user').send({
            firstName : "",
            lastName : "",
            userType:"user",
            username:"Jojo",
            password:"coucou",
            email:"jojodu25@gmail.com"
        }).end((err, res)=>{
            res.should.has.status(201)
            users.push(res.body)
            done()
        })
    })
    it("login correct user",(done)=>{
         chai.request(server).post('/login').send({
            username:"Jojo",
            password:"coucou"
        }).end((err, res) => {
            res.should.has.status(200)
            token.push(res.body.token)
            done()
        })
    })
    it("add professional with supplementary property - S",(done) => {
        chai.request(server).post('/user').send({
            firstName : "Nelson",
            lastName : "Mosini",
            userType:"professional",
            username:"Titi",
            password:"coucou",
            email:"titiLeMurgule@gmail.com",
            bibiPower:"tripleDose"
        }).end((err, res)=>{
            res.should.has.status(201)
            users.push(res.body)
            done()
        })
    })
    it("login correct user",(done)=>{
         chai.request(server).post('/login').send({
            username:"Titi",
            password:"coucou"
        }).end((err, res) => {
            res.should.has.status(200)
            token.push(res.body.token)
            done()
        })
    })
    it("add users with duplicate property - E",(done) => {
        chai.request(server).post('/user').send({
            firstName : "Nelson",
            lastName : "Mosini",
            userType:"user",
            username:"Titi",
            password:"coucou",
            email:"Nelson@gmail.com",
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("login correct user",(done)=>{
         chai.request(server).post('/login').send({
            username:"Titi",
            password:"coucou"
        }).end((err, res) => {
            res.should.has.status(200)
            token.push(res.body.token)
            done()
        })
    })
    it("add professional with firstName and lastName missing - E",(done) => {
        chai.request(server).post('/user').send({
            firstName : "",
            lastName : "",
            userType:"professional",
            username:"La Gazette du Dimanche",
            password:"coucou",
            email:"GazetteDuDimanche@gmail.com",
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add user with uncorrect userType - E",(done) => {
        chai.request(server).post('/user').send({
            firstName : "Gizmo",
            lastName : "Zeus",
            userType:"yo",
            username:"La Gazette du Dimanche",
            password:"coucou",
            email:"GazetteDuDimanche@gmail.com",
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
})

describe("GET - /user/:id",()=>{
    it('find user with correct id - S',(done) => {
        chai.request(server).get(`/user/${users[0]._id}`).auth(token[0],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('find user with correct id not authentifiate - S',(done) => {
        chai.request(server).get(`/user/${users[0]._id}`).end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })
    it('find user with unexist id - E',(done) => {
        chai.request(server).get(`/user/669a53c2e9ef945efd92d111`).auth(token[0],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('find user with uncorrect id - E',(done) => {
        chai.request(server).get(`/user/Lalalalala`).auth(token[0],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('find user with null id - E',(done) => {
        chai.request(server).get(`/user/`).auth(token[0],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe("PUT - /user/:id",()=>{
    it('update correct id with correct value - S', (done)=>{
        chai.request(server).put(`/user/${users[0]._id}`).send({email:"laVieDesCornichons@orange.fr"}).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('update unexisting id with correct value - E', (done)=>{
        chai.request(server).put(`/user/669a53c2e9ef945efd92d111`).send({email:"hellohello@orange.fr"}).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('update uncorrect id with correct value - E', (done)=>{
        chai.request(server).put(`/user/669a53c2e9`).send({email:"hellohello@orange.fr"}).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('update correct id with duplicate value - E', (done)=>{
        chai.request(server).put(`/user/${users[0]._id}`).send({email:"jojodu25@gmail.com"}).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('update correct id of professional to empty firstName  - E', (done)=>{
        chai.request(server).put(`/user/${users[2]._id}`).send({firstName:""}).auth(token[2],{type: 'bearer'}).end((err, res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('update correct id with empty body  - S', (done)=>{
        chai.request(server).put(`/user/${users[0]._id}`).send({}).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('update correct id with queryMissing  - E', (done)=>{
        chai.request(server).put(`/user/${users[0]._id}`).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('update correct with id missing  - E', (done)=>{
        chai.request(server).put(`/user`).auth(token[0],{type: 'bearer'}).end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe("/DELETE -/user:id",()=>{
    it('delete null id - E',(done)=>{
        chai.request(server).delete('/user/').auth(token[0],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('delete uncorrect id - E',(done)=>{
        chai.request(server).delete(`/user/tititi`).auth(token[0],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('delete unexisting id - E',(done)=>{
        chai.request(server).delete(`/user/669a53c2e9ef945efd92d111`).auth(token[0],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('delete correct id with wrong user - E',(done)=>{
        chai.request(server).delete(`/user/${users[0]._id}`).auth(token[1],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })
    it('delete correct id not authentifiate - E',(done)=>{
        chai.request(server).delete(`/user/${users[0]._id}`).auth(token[1],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(401)
            done()
        })
    })
    it('delete correct id - S',(done)=>{
        chai.request(server).delete(`/user/${users[0]._id}`).auth(token[0],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(200)
            users.splice(0,1)
            done()
        })
    })
    it('check comment one is deleted - S',(done)=>{
        chai.request(server).get(`/comment/${comments[0]._id}`).end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('check comment two is deleted - S',(done)=>{
        chai.request(server).get(`/comment/${comments[1]._id}`).end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('check like first comment is deleted - S',(done) =>{
        LikeCommentService.findOneLikeCommentById(like[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-found")
            done()
        })
    })
    it('check like second comment is deleted - S',(done) =>{
        LikeCommentService.findOneLikeCommentById(like[1]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-found")
            done()
        })
    })
    it('delete correct id - S',(done)=>{
        chai.request(server).delete(`/user/${users[0]._id}`).auth(token[1],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(200)
            users.splice(0,1)
            done()
        })
    })
    it('delete correct id - S',(done)=>{
        chai.request(server).delete(`/user/${users[0]._id}`).auth(token[2],{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(200)
            users.splice(0,1)
            done()
        })
    })
    
})