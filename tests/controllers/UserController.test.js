const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require('./../../server')

chai.use(chaiHttp)

const users = []

describe("POST - /User",()=>{
    it("add correct users - S",(done) => {
        chai.request(server).post('/user').send({
            firstName : "Eric",
            lastName : "Dupond",
            userType:"user",
            userName:"EricLaDébrouille",
            password:"coucou",
            email:"eric.dupond@gmail.com"
        }).end((err, res)=>{
            res.should.has.status(201)
            users.push(res.body)
            done()
        })
    })
    it("add correct users with minimal property - S",(done) => {
        chai.request(server).post('/user').send({
            firstName : "",
            lastName : "",
            userType:"user",
            userName:"Jojo",
            password:"coucou",
            email:"jojodu25@gmail.com"
        }).end((err, res)=>{
            res.should.has.status(201)
            users.push(res.body)
            done()
        })
    })
    it("add professional with supplementary property - S",(done) => {
        chai.request(server).post('/user').send({
            firstName : "Nelson",
            lastName : "Mosini",
            userType:"professional",
            userName:"Titi",
            password:"coucou",
            email:"titiLeMurgule@gmail.com",
            bibiPower:"tripleDose"
        }).end((err, res)=>{
            res.should.has.status(201)
            users.push(res.body)
            done()
        })
    })
    it("add users with duplicate property - E",(done) => {
        chai.request(server).post('/user').send({
            firstName : "Nelson",
            lastName : "Mosini",
            userType:"user",
            userName:"Titi",
            password:"coucou",
            email:"Nelson@gmail.com",
        }).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add professional with firstName and lastName missing - E",(done) => {
        chai.request(server).post('/user').send({
            firstName : "",
            lastName : "",
            userType:"professional",
            userName:"La Gazette du Dimanche",
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
            userName:"La Gazette du Dimanche",
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
        chai.request(server).get(`/user/${users[0]._id}`).end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('find user with unexist id - E',(done) => {
        chai.request(server).get(`/user/669a53c2e9ef945efd92d111`).end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('find user with uncorrect id - E',(done) => {
        chai.request(server).get(`/user/Lalalalala`).end((err,res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('find user with null id - E',(done) => {
        chai.request(server).get(`/user/`).end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe("PUT - /user/:id",()=>{
    it('update correct id with correct value - S', (done)=>{
        chai.request(server).put(`/user/${users[0]._id}`).send({email:"laVieDesCornichons@orange.fr"}).end((err, res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('update unexisting id with correct value - E', (done)=>{
        chai.request(server).put(`/user/669a53c2e9ef945efd92d111`).send({email:"hellohello@orange.fr"}).end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('update uncorrect id with correct value - E', (done)=>{
        chai.request(server).put(`/user/669a53c2e9`).send({email:"hellohello@orange.fr"}).end((err, res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('update correct id with duplicate value - E', (done)=>{
        chai.request(server).put(`/user/${users[0]._id}`).send({email:"jojodu25@gmail.com"}).end((err, res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('update correct id of professional to empty firstName  - E', (done)=>{
        chai.request(server).put(`/user/${users[2]._id}`).send({firstName:""}).end((err, res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('update correct id with empty body  - S', (done)=>{
        chai.request(server).put(`/user/${users[0]._id}`).send({}).end((err, res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('update correct id with queryMissing  - E', (done)=>{
        chai.request(server).put(`/user/${users[0]._id}`).end((err, res)=>{
            res.should.have.status(200)
            done()
        })
    })
    it('update correct with id missing  - S', (done)=>{
        chai.request(server).put(`/user`).end((err, res)=>{
            res.should.have.status(404)
            done()
        })
    })
})

describe("/DELETE -/user:id",()=>{
    it('delete null id - E',(done)=>{
        chai.request(server).delete('/user/').end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('delete uncorrect id - E',(done)=>{
        chai.request(server).delete(`/user/tititi`).end((err,res)=>{
            res.should.have.status(405)
            done()
        })
    })
    it('delete unexisting id - E',(done)=>{
        chai.request(server).delete(`/user/669a53c2e9ef945efd92d111`).end((err,res)=>{
            res.should.have.status(404)
            done()
        })
    })
    it('delete correct id - S',(done)=>{
        chai.request(server).delete(`/user/${users[0]._id}`).end((err,res)=>{
            res.should.have.status(200)
            users.splice(0,1)
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