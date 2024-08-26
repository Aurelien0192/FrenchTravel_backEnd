const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect
const server = require('./../../server')

chai.use(chaiHttp)

let user = {}
const places = []
let token = {}
const favorites = []

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
        chai.request(server).post('/place').send(goodHotel).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(201)
            places.push(res.body)
            done()
        })
    })
})
describe("POST - /favorite",()=>{
    it("add a correct place in favorite - S",(done)=>{
        chai.request(server).post(`/favorite/${places[0]._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(201)
            favorites.push(res.body)
            done()
        })
    })
    it("add in favorite with uncorrect id of place - E",(done)=>{
        chai.request(server).post(`/favorite/${"fezihizeze"}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("add in favorite with missing id of place - E",(done)=>{
        chai.request(server).post(`/favorite/`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it("add in favorite with correct id of place but not exist - E",(done)=>{
        chai.request(server).post(`/favorite/${user._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it("add in favorite with correct id of place but not authentifiate - E",(done)=>{
        chai.request(server).post(`/favorite/${user._id}`).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
})
describe("GET - /favorites",()=>{
    it("find many favorites with place id - S",(done)=>{
        chai.request(server).get('/favorites').query({ids:places[0]._id}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many favorites without place id - S",(done)=>{
        chai.request(server).get('/favorites').auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many favorites by search - S",(done)=>{
        chai.request(server).get('/favorites').query({search:"Château"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many favorites by search but not exist in database - S",(done)=>{
        chai.request(server).get('/favorites').query({search:"zefzef"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many favorites by categorie - S",(done)=>{
        chai.request(server).get('/favorites').query({categorie:"hotel"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many favorites with uncorrect place id - E",(done)=>{
        chai.request(server).get('/favorites').query({ids:"jiodeorre"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("find many favorites with missing place id - S",(done)=>{
        chai.request(server).get('/favorites').query({ids:null}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many favorites with correct place id but not exist in database - S",(done)=>{
        chai.request(server).get('/favorites').query({ids:user._id}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("find many favorites with correct place id but user not authentifiate - E",(done)=>{
        chai.request(server).get('/favorites').query({ids:places[0]._id}).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
})
describe("PUT - /favorite/:id",()=>{
    it("modify favorite with good favorite id and good body - S",(done)=>{
        chai.request(server).put(`/favorite/${favorites[0]._id}`).send({visited:true}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("modify favorite with uncorrect favorite id and good body - E",(done)=>{
        chai.request(server).put(`/favorite/${"vsdjveho"}`).send({visited:true}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("modify favorite with correct favorite id but not exist in database and good body - E",(done)=>{
        chai.request(server).put(`/favorite/${user._id}`).send({visited:true}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it("modify favorite with good favorite id and try change immutable field - S",(done)=>{
        chai.request(server).put(`/favorite/${favorites[0]._id}`).send({place:user._id}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("modify favorite with good favorite id with unexpect field - S",(done)=>{
        chai.request(server).put(`/favorite/${favorites[0]._id}`).send({visited:false, coucou:"coucou"}).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
    it("modify favorite with good favorite id and good body but not authentifiate- E",(done)=>{
        chai.request(server).put(`/favorite/${favorites[0]._id}`).send({visited:true}).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it("modify favorite with good favorite id and missing query - E",(done)=>{
        chai.request(server).put(`/favorite/${favorites[0]._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            done()
        })
    })
})
describe("DELETE - /favorite/:id",()=>{
    it("delete one favorite with uncorrect place and user id - E",(done)=>{
        chai.request(server).delete(`/favorite/${"dscooje"}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("delete one favorite with correct place but not exist in database and user id - E",(done)=>{
        chai.request(server).delete(`/favorite/${user._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it("delete one favorite with correct place not authentifiate - E",(done)=>{
        chai.request(server).delete(`/favorite/${places[0]._id}`).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it("delete one favorite with correct place and user id - S",(done)=>{
        chai.request(server).delete(`/favorite/${places[0]._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
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