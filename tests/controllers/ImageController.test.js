const chai = require('chai')
const chaiHttp = require('chai-http')
const fs = require('fs')
const should = chai.should()
const expect = chai.expect
const assert = chai.assert
const server = require('./../../server')
let user = {}
let token = ""
let place = {}
const images = []

chai.use(chaiHttp)

describe('prepare data for test',()=>{
    it('create a user for test',(done)=>{
        chai.request(server).post('/user').send({
            firstName : "Eric",
            lastName : "Dupond",
            userType:"professional",
            username:"EricLaDébrouille",
            password:"coucou",
            email:"eric.dupond@gmail.com"
        }).end((err, res)=>{
            res.should.has.status(201)
            user ={...res.body}
            done()
        })
    })
    it("login correct user",(done)=>{
         chai.request(server).post('/login').send({
            username:"EricLaDébrouille",
            password:"coucou"
        }).end((err, res) => {
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
describe("POST - /image",()=>{
    it('add one correct image - S',(done)=>{
        chai.request(server).post('/image').auth(token,{type:'bearer'}).attach('image',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image1.jpeg`), 'image1.jpeg').field("place_id", place._id).end((err, res)=>{
            res.should.has.status(201)
            expect(res.body).haveOwnProperty("_id")
            expect(res.body).to.haveOwnProperty("path")
            images.push(res.body)
            assert.isOk(fs.existsSync(`${__dirname}../../../${images[0].path}`))
            done()
        })
    })
    it('add one correct image but not authentifiate - E',(done)=>{
        chai.request(server).post('/image').attach('image',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image2.jpeg`),  'image2.jpeg').field("place_id", place._id).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it('add one correct image but place_id missing - E',(done)=>{
        chai.request(server).post('/image').auth(token,{type:'bearer'}).attach('image',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image3.jpeg`),  'image3.jpeg').end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('add one correct image but place_id uncorrect - E',(done)=>{
        chai.request(server).post('/image').auth(token,{type:'bearer'}).attach('image',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image4.jpeg`),  'image4.jpeg').field('place_id',"rhioegah").end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('add one correct image but place_id not exist in database - E',(done)=>{
        chai.request(server).post('/image').auth(token,{type:'bearer'}).attach('image',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image5.jpeg`),  'image5.jpeg').field('place_id',user._id).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it('add image with uncorrect files - E',(done)=>{
        chai.request(server).post('/image').auth(token,{type:'bearer'}).attach('image',fs.readFileSync(`${__dirname}../../../data/imagesForTest/output.css`), 'output.css').field('place_id',place._id).end((err, res)=>{
            res.should.has.status(405)
            assert.isNotOk(fs.existsSync(`${__dirname}../../../output.css`))
            done()
        })
    })
})
describe('/POST - /images',() =>{
    it('add many images with correct information - S',(done) => {
        chai.request(server).post('/images').auth(token,{type:"bearer"})
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image1.jpeg`),  'image1.jpeg')
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image5.jpeg`),  'image5.jpeg')
        .field("place_id",place._id).end((err, res)=>{
            res.should.has.status(201)
            assert.isOk(fs.existsSync(`${__dirname}../../../${res.body[0].path}`))
            assert.isOk(fs.existsSync(`${__dirname}../../../${res.body[1].path}`))
            done()
        })
    })
    it('add many images not authentifiate - E',(done) => {
        chai.request(server).post('/images')
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image1.jpeg`),  'image1.jpeg')
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image5.jpeg`),  'image5.jpeg')
        .field("place_id",place._id).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it('add many images with uncorrect place_id - E',(done) => {
        chai.request(server).post('/images').auth(token,{type:"bearer"})
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image1.jpeg`),  'image1.jpeg')
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image5.jpeg`),  'image5.jpeg')
        .field("place_id","dfvoihvzho").end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it('add many images with not existing place_id in database - E',(done) => {
        chai.request(server).post('/images').auth(token,{type:"bearer"})
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image1.jpeg`),  'image1.jpeg')
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image5.jpeg`),  'image5.jpeg')
        .field("place_id",user._id).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it('add many images with one is not image - E',(done) => {
        chai.request(server).post('/images').auth(token,{type:"bearer"})
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/image1.jpeg`),  'image1.jpeg')
        .attach('images',fs.readFileSync(`${__dirname}../../../data/imagesForTest/output.css`),  'output.css')
        .field("place_id",place._id).end((err, res)=>{
            res.should.has.status(201)
            assert.isOk(fs.existsSync(`${__dirname}../../../${res.body[0].path}`))
            assert.isNotOk(fs.existsSync(`${__dirname}../../../output.css`))
            done()
        })
    })
})
describe("GET - /images",()=>{
    it('find many images when user authentifiate - S',(done)=>{
        chai.request(server).get('/images').auth(token,{type:"bearer"}).end((err, res) => {
            res.should.has.status(200)
            done()
        })
    })
    it('find many images not authentifiate - E',(done)=>{
        chai.request(server).get('/images').end((err, res) => {
            res.should.has.status(401)
            done()
        })
    })
})
describe("DELETE - /image/:id",()=>{
    it("delete one image with not existing photo",(done)=>{
        chai.request(server).delete(`/image/${user._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(404)
            done()
        })
    })
    it("delete one image with uncorrect id",(done)=>{
        chai.request(server).delete(`/image/czjojs`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(405)
            done()
        })
    })
    it("delete one image with uncorrect id",(done)=>{
        chai.request(server).delete(`/image/${images[0]._id}`).end((err, res)=>{
            res.should.has.status(401)
            done()
        })
    })
    it("delete one image with correct information",(done)=>{
        chai.request(server).delete(`/image/${images[0]._id}`).auth(token,{type: 'bearer'}).end((err, res)=>{
            res.should.has.status(200)
            assert.isNotOk(fs.existsSync(`${__dirname}../../../${images[0].path}`))
            done()
        })
    })
})
describe('delete data needed for test',()=>{
    it('delete correct id - S',(done)=>{
        chai.request(server).delete(`/user/${user._id}`).auth(token,{type: 'bearer'}).end((err,res)=>{
            res.should.have.status(200)
            done()
        })
    })
})
