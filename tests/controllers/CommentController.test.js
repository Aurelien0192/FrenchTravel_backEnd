const chai = require('chai')
const chaiHttp = require('chai-http')
const LikeCommentService = require('../../services/LikeCommentService').LikeCommentService
const should = chai.should()
const _ = require("lodash")
const expect = chai.expect
const server = require('./../../server')

chai.use(chaiHttp)

const user = []
const places = []
const tokens = []
const comments = []
let like = {}

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
            tokens.push(res.body.token) 
            done()
        })
    })
    it("add another user for test - S",(done)=>{
        chai.request(server).post('/user').send({
            firstName : "titi",
            lastName : "titi",
            userType:"user",
            username:"titi",
            password:"titi",
            email:"titi@gmail.com"
        }).end((err, res)=>{
            res.should.has.status(201)
            user.push(res.body)
            done()
        })
    })
    it("login another correct user",(done)=>{
        chai.request(server).post('/login').send({
            username:"titi",
            password:"titi"
        }).end((err,res)=>{
            res.should.has.status(200)
            tokens.push(res.body.token) 
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
        chai.request(server).post('/place').send(goodHotel).auth(tokens[0],{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(201)
            places.push(res.body)
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
        chai.request(server).post('/place').send(goodHotel).auth(tokens[0],{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(201)
            places.push(res.body)
            done()
        })
    })
})
describe("/POST - addOneComment",() => {
    it("add correct comment to a good place with correct user - S",(done) => {
        chai.request(server).post('/comment').auth(tokens[0],{type: 'bearer'}).query({place_id:places[0]._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:4,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(201)
            comments.push(res.body)
            done()
        })
    })
    it("add correct comment to a good place with correct user add unwantedField - S",(done) => {
        chai.request(server).post('/comment').auth(tokens[1],{type: 'bearer'}).query({place_id:places[0]._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:4,
            dateVisited: new Date(),
            hello:"hello"
        }).end((err, res)=>{
            res.should.has.status(201)
            comments.push(res.body)
            done()
        })
    })
    it("add a like to the comment",(done)=>{
        chai.request(server).post('/like').query({comment_id:comments[0].id}).auth(tokens[0],{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(201)
            like = {...res.body}
            done()
        })
    })
    it("add correct comment to a uncorrect ID place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(tokens[0],{type: 'bearer'}).query({place_id:"66b0658a72ec"}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add correct comment to a missing ID place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(tokens[0],{type: 'bearer'}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add correct comment to a good place with user not authentifiate - E",(done) => {
        chai.request(server).post('/comment').query({place_id:places[0]._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it("add comment missing comment property to a good place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(tokens[0],{type: 'bearer'}).query({place_id:places[0]._id}).send({
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add comment with string in note to a good place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(tokens[0],{type: 'bearer'}).query({place_id:places[0]._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:"dvjvovjeio",
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add comment with note above of max to a good place with correct user - E",(done) => {
        chai.request(server).post('/comment').auth(tokens[0],{type: 'bearer'}).query({place_id:places[0]._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:10,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add correct comment to a good place with correct user but second post - E",(done) => {
        chai.request(server).post('/comment').auth(tokens[0],{type: 'bearer'}).query({place_id:places[0]._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add comment with unwanted field in second place - S",(done) => {
        chai.request(server).post('/comment').auth(tokens[0],{type: 'bearer'}).query({place_id:places[1]._id}).send({
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date(),
            categorie:"hotel"
        }).end((err, res)=>{
            res.should.has.status(201)
            done()
        })
    })
})
describe("POST - /responseComment/:id",()=>{
    it("add correct response with good user but uncorrect id - E",(done)=>{
        chai.request(server).post(`/responseComment/${"dfsdiogsrj"}`).auth(tokens[0],{type: 'bearer'}).send({
            comment:"merci pour ce commentaire"
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add response with comment empty response with good user - E",(done)=>{
        chai.request(server).post(`/responseComment/${comments[0]._id}`).auth(tokens[0],{type: 'bearer'}).send({
            comment:""
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add response with missing body with good user - E",(done)=>{
        chai.request(server).post(`/responseComment/${comments[0]._id}`).auth(tokens[0],{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add correct response with good user - S",(done)=>{
        chai.request(server).post(`/responseComment/${comments[0]._id}`).auth(tokens[0],{type: 'bearer'}).send({
            comment:"merci pour ce commentaire"
        }).end((err, res)=>{
            res.should.has.status(201)
            done()
        })
    })
    it("add correct response with not authentifiate user - E",(done)=>{
        chai.request(server).post(`/responseComment/${comments[0]._id}`).send({
            comment:"merci pour ce commentaire"
        }).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it("respond another time in same comment - E",(done)=>{
        chai.request(server).post(`/responseComment/${comments[0]._id}`).auth(tokens[0],{type: 'bearer'}).send({
            comment:"merci pour ce commentaire"
        }).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it("unauthorized user try to response at one comment - E",(done)=>{
        chai.request(server).post(`/responseComment/${comments[1]._id}`).auth(tokens[1],{type: 'bearer'}).send({
            comment:"merci pour ce commentaire"
        }).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
})
describe('GET - /comment/:id',()=>{
    it("find comment with correct ID - S",(done)=>{
        chai.request(server).get(`/comment/${comments[0]._id}`).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find comment with uncorrect ID - E",(done)=>{
        chai.request(server).get(`/comment/zefefze`).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("find comment with correct ID but not exist in database - E",(done)=>{
        chai.request(server).get(`/comment/${user[0]._id}`).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it("find comment with missing ID but not exist in database - E",(done)=>{
        chai.request(server).get(`/comment/`).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
})
describe('GET - /comments',()=>{
    it("find many comments with correct query associated place - S",(done)=>{
        chai.request(server).get("/comments").query({page:1,limit:4,visitor_id:user[0]._id, place_id:places[0]._id}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many comments with correct query associated user - S",(done)=>{
        chai.request(server).get("/comments").query({page:1,limit:4, user_id:user[0]._id}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many comments with correct with uncorrect user id - E",(done)=>{
        chai.request(server).get("/comments").query({page:1,limit:4, user_id:"grjeoigre"}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("find many comments with correct with missing user id - E",(done)=>{
        chai.request(server).get("/comments").query({page:1,limit:4, user_id:null}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("find many comments with correct with missing query - S",(done)=>{
        chai.request(server).get("/comments").end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("find many comments with correct with correct user ID but missing in Database - E",(done)=>{
        chai.request(server).get("/comments").query({page:1,limit:4, user_id:comments[0]._id}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
})
describe("GET - /commentsByOwner",() =>{
    it("find comments with professional one - S",(done)=>{
        chai.request(server).get('/commentsByOwner').auth(tokens[0],{type: 'bearer'}).end((err, res)=>{
            expect(res.body).to.be.a('object')
            expect(res.body.results).to.be.an('array')
            res.body.results.forEach((result)=>{
                expect(String(result.place_id[0]._id)).to.contain.oneOf(_.map(places, (e)=>{return String(e._id)}))
            })
            res.should.has.status(200)
            done()
        })
    })
    it("find comments with user - E",(done)=>{
        chai.request(server).get('/commentsByOwner').auth(tokens[1],{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it("find comments not authentifiate - E",(done)=>{
        chai.request(server).get('/commentsByOwner').end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
})
describe("DELETE - /comment/:id",() => {
    it("delete one comment not authentifiate - E",(done)=>{
        chai.request(server).delete(`/comment/${comments[0]._id}`).end((err, res) =>{
            res.should.has.status(401)
            done()
        })
    })
    it("delete one comment with not owner of comment - E",(done)=>{
        chai.request(server).delete(`/comment/${comments[0]._id}`).auth(tokens[1],{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(401)
            done()
        })
    })
    it("delete one comment with uncorrect id - E",(done)=>{
        chai.request(server).delete(`/comment/dfherivhr`).auth(tokens[0],{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(405)
            done()
        })
    })
    it("delete one comment with correct id but not exist in database - E",(done)=>{
        chai.request(server).delete(`/comment/${places[0]._id}`).auth(tokens[1],{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(404)
            done()
        })
    })
    it("delete one comment with missing id - E",(done)=>{
        chai.request(server).delete(`/comment/${places[0]._id}`).auth(tokens[1],{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(404)
            done()
        })
    })
    it("delete one comment with correct id and correct user - S",(done)=>{
        chai.request(server).delete(`/comment/${comments[0]._id}`).auth(tokens[0],{type: 'bearer'}).end((err, res) =>{
            comments.splice(0,1)
            res.should.has.status(200)
            done()
        })
    })
    it("check like is correctly deleting - S",(done) =>{
        LikeCommentService.findOneLikeCommentById(like._id,null, function(err, value){
            expect(err).to.be.a("object")
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal("no-found")
            done()
        })
    })
})

describe("deleteTheUser",() => {
    it("delete user - S",(done) => {
        chai.request(server).delete(`/user/${user[0]._id}`).auth(tokens[0],{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(200)
            done()
        })
    })
    it("delete another user - S",(done) => {
        chai.request(server).delete(`/user/${user[1]._id}`).auth(tokens[1],{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(200)
            done()
        })
    })
})