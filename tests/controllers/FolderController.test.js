const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require('./../../server')

chai.use(chaiHttp)

let user = {}
let token = ""
const folders = []

describe("create good user, login, place and comment for test",()=>{
    it("create good user",(done) => {
            const goodUser ={
            firstName : "Eric",
            lastName : "Dupond",
            userType:"professional",
            username:"EricLaDébrouille",
            password:"coucou",
            email:"eric.dupond@gmail.com"
        }
        chai.request(server).post('/user').send(goodUser).end((err, res) => {
            res.should.has.status(201)
            user = {...res.body}
            done()
        })
    })
    it("login correct user",(done)=>{
        chai.request(server).post('/login').send({
            username:user.username,
            password:"coucou"
        }).end((err,res)=>{
            res.should.has.status(200)
            token = res.body.token
            done()
        })
    })
})

describe('POST - /folder', ()=>{
    it('add a good folder with correct infomrmation - S',(done)=>{
        chai.request(server).post("/folder").auth(token,{type: 'bearer'}).send({name:"vacances"}).end((err, res)=>{
            res.should.has.status(201)
            folders.push(res.body)
            done()
        })
    })
    it('create a folder with correct unexpected field - S',(done)=>{
        chai.request(server).post("/folder").auth(token,{type: 'bearer'}).send({name:"vacances", coucou: "c'est moi"}).end((err, res)=>{
            res.should.has.status(201)
            folders.push(res.body)
            done()
        })
    })
    it('create a folder not authentifiate - E',(done)=>{
        chai.request(server).post("/folder").send({name:"vacances", coucou: "c'est moi"}).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it('create a folder with empty name information - E',(done)=>{
        chai.request(server).post("/folder").auth(token,{type: 'bearer'}).send({name:""}).end((err, res)=>{
            res.should.has.status(405)
            folders.push(res.body)
            done()
        })
    })
    it('create a folder without body - E',(done)=>{
        chai.request(server).post("/folder").auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            folders.push(res.body)
            done()
        })
    })
})
describe("GET - /folder/:id",()=>{
    it('find a folder with correct id - S',(done)=>{
        chai.request(server).get(`/folder/${folders[0]._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it('find a folder with uncorrect id - E',(done)=>{
        chai.request(server).get(`/folder/erjirere`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('find a folder with correct id but not exist in database - E',(done)=>{
        chai.request(server).get(`/folder/${user._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it('find a folder with correct id but not authentifiate - E',(done)=>{
        chai.request(server).get(`/folder/${folders[0]._id}`).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
})
describe("GET - /folders",()=>{
    it('find many folders with correct user id - S',(done)=>{
        chai.request(server).get('/folders').auth(token,{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(200)
            done()
        })
    })
    it('find many folders not connected - E',(done)=>{
        chai.request(server).get('/folders').end((err, res) =>{
            res.should.has.status(401)
            done()
        })
    })
})
describe("PUT - /folder/:id",()=>{
    it('update one folder with correct id and correct information - S',(done)=>{
        chai.request(server).put(`/folder/${folders[0]._id}`).send({name:"provence"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it('update one folder with correct id but not exist in database and correct information - S',(done)=>{
        chai.request(server).put(`/folder/${user._id}`).send({name:"provence"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it('update one folder with correct id empty name - E',(done)=>{
        chai.request(server).put(`/folder/${folders[0]._id}`).send({name:""}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('update one folder with correct id but body missing - E',(done)=>{
        chai.request(server).put(`/folder/${folders[0]._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('update one folder with correct id but wrong field in body - E',(done)=>{
        chai.request(server).put(`/folder/${folders[0]._id}`).send({coucou:"provence"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('update one folder with correct id but supplementary field in body - E',(done)=>{
        chai.request(server).put(`/folder/${folders[0]._id}`).send({name:"provence", coucou:"provence"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('update one folder with uncorrect id and correct information - E',(done)=>{
        chai.request(server).put(`/folder/rejireiefz`).send({name:"provence"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('update one folder with correct id and correct information but not authentifiate - E',(done)=>{
        chai.request(server).put(`/folder/${folders[0]._id}`).send({name:"provence"}).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
})
describe('DELETE - /folder/:id',()=>{
    it('delete one folder with uncorrect id - E',(done)=>{
        chai.request(server).delete(`/folder/fejeirhgerigr`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('delete one folder without authentifiate - E',(done)=>{
        chai.request(server).delete(`/folder/${folders[0]._id}`).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it('delete one folder with correct id but not exist in database - E',(done)=>{
        chai.request(server).delete(`/folder/${user._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it('delete one folder - S',(done)=>{
        chai.request(server).delete(`/folder/${folders[0]._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
})

describe("deleteTheUser",() => {
    it("delete user - S",(done) => {
        chai.request(server).delete(`/user/${user._id}`).auth(token,{type: 'bearer'}).end((err, res) =>{
            res.should.has.status(200)
            done()
        })
    })
})