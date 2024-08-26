const chai = require('chai') 
const FolderService = require("../../services/FolderService").FolderService
const UserService = require('../../services/UserService').UserService
const FavoriteService = require('../../services/FavoriteService').FavoriteService
const PlaceService = require('../../services/PlaceService').PlaceService

let expect = chai.expect

let user = {}
let place = {}
let favorite = {}
const folders = []

describe('create user, place and favorite for test',() => {
    const goodUser ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"professional",
        username:"EricLaDébrouille",
        password:"coucou",
        email:"eric.dupond@gmail.com"
    }
    it("user creation",(done)=>{
        UserService.addOneUser(goodUser, null, function(err, value){
            user = {...value}
            done()
        })
    })
    it('place creation',(done)=>{
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
        PlaceService.addOnePlace(goodHotel,user._id, null, function(err, value){
            place = {...value}
            done()
        })
    })
    it('add a favorite',(done)=>{
        FavoriteService.addOneFavorite(user._id, place._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("user")
            expect(value).to.haveOwnProperty("place")
            expect(String(value["user"])).to.be.equal(String(user._id))
            expect(String(value['place'])).to.be.equal(String(place._id))
            favorite = {...value}
            done()
        })
    })
})

describe('addOneFolder',()=>{
    it('create a folder with correct information - S',(done)=>{
        FolderService.addOneFolder(user._id, {name: "vacances"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('user')
            expect(value).to.haveOwnProperty('name')
            expect(String(value['user'])).to.be.equal(String(user._id))
            expect(value["name"]).to.be.equal("vacances")
            folders.push(value)
            done()
        })
    })
    it('create a folder with correct unexpected field - S',(done)=>{
        FolderService.addOneFolder(user._id, {name: "vacances", coucou:"c'est moi"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('user')
            expect(value).to.haveOwnProperty('name')
            expect(String(value['user'])).to.be.equal(String(user._id))
            expect(value["name"]).to.be.equal("vacances")
            expect(value).to.not.haveOwnProperty('coucou')
            folders.push(value)
            done()
        })
    })
    it('create a folder with correct information but uncorrect user_id - E',(done)=>{
        FolderService.addOneFolder("fsjoizej", {name: "vacances"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('create a folder with correct information but missing user_id - E',(done)=>{
        FolderService.addOneFolder(null, {name: "vacances"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('create a folder with empty name information - E',(done)=>{
        FolderService.addOneFolder(user._id, {name: ""}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            done()
        })
    })
    it('create a folder with missing body information - E',(done)=>{
        FolderService.addOneFolder(user._id, null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('add a favorite in folder vacances - S',(done)=>{
        FavoriteService.updateOneFavorite(favorite._id, {folder:folders[0]._id}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('folder')
            expect(String(value['folder'])).to.be.equal(String(folders[0]._id))
            done()
        })
    })
})
describe("findOneFolderById",()=>{
    it('find a folder with a favorite inside - S',(done)=>{
        FolderService.findOneFolderById(folders[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('favorites')
            expect(String(value['_id'])).to.be.equal(String(folders[0]._id))
            expect(value['favorites']).to.be.an('array')
            expect(value['favorites']).to.lengthOf(1)
            expect(value['favorites'][0]).to.haveOwnProperty('_id')
            expect(String(value['favorites'][0]['_id'])).to.be.equal(String(favorite._id))
            done()
        })
    })
    it('find a folder without a favorite inside - S',(done)=>{
        FolderService.findOneFolderById(folders[1]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(value).to.haveOwnProperty('favorites')
            expect(String(value['_id'])).to.be.equal(String(folders[1]._id))
            expect(value['favorites']).to.be.an('array')
            expect(value['favorites']).to.lengthOf(0)
            done()
        })
    })
    it('find a folder with uncorrect id - E',(done)=>{
        FolderService.findOneFolderById("eriojgrijg", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('find a folder with missing id - E',(done)=>{
        FolderService.findOneFolderById(null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('find a folder with correct id but not exist in database - E',(done)=>{
        FolderService.findOneFolderById(user._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})
describe("findManyFolders",()=>{
    it('find many folders with correct user id - S',(done)=>{
        FolderService.findManyFolders(null, null, user._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("count")
            expect(value['count']).to.be.equal(2)
            expect(value).to.haveOwnProperty('results')
            expect(value['results']).to.be.an("array")
            expect(value['results']).to.lengthOf(2)
            value.results.forEach((result)=>{
                expect(result).to.be.a('object')
                expect(result).to.haveOwnProperty('user')
                expect(String(result['user'])).to.be.equal(String(user._id))
            })
            done()
        })
    })
    it('find many folders with uncorrect user id - E',(done)=>{
        FolderService.findManyFolders(null, null, "dfvljdfvk", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('find many folders with missing user id - E',(done)=>{
        FolderService.findManyFolders(null, null, null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('find many folders with correct user id but not exist in database - E',(done)=>{
        FolderService.findManyFolders(null, null, place._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("count")
            expect(value['count']).to.be.equal(0)
            expect(value).to.haveOwnProperty('results')
            expect(value['results']).to.be.an("array")
            expect(value['results']).to.lengthOf(0)
            done()
        })
    })
})
describe('updateOneFolderById',()=>{
    it('update one folder with correct id and correct information - S',(done)=>{
        FolderService.updateFolderById(folders[0]._id,{name:"provence"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(value['name']).to.be.equal('provence')
            done()
        })
    })
    it('update one folder with correct id but empty name - E',(done)=>{
        FolderService.updateFolderById(folders[0]._id,{name:""}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            done()
        })
    })
    it('update one folder with correct id but body missing - E',(done)=>{
        FolderService.updateFolderById(folders[0]._id,null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('update one folder with correct id but wrong field in body - E',(done)=>{
        FolderService.updateFolderById(folders[0]._id,{coucou: "c'est moi"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('update one folder with correct id but supplementary field in body - E',(done)=>{
        FolderService.updateFolderById(folders[0]._id,{name:"vacances", coucou: "c'est moi"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('update one folder with correct body but uncorrect id - E',(done)=>{
        FolderService.updateFolderById("odfbhre",{name:"vacances"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('update one folder with correct body but missing id - E',(done)=>{
        FolderService.updateFolderById(null,{name:"vacances"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
})
describe('deleteOneFolderById',()=>{
    it('delete one folder with uncorrect id - E',(done)=>{
        FolderService.deleteOneFolderById("dvvjerovjrev", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('delete one folder with missing id - E',(done)=>{
        FolderService.deleteOneFolderById(null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('delete one folder with correct id but not exist in database - E',(done)=>{
        FolderService.deleteOneFolderById("66c478abc41f2aa9977ad3ea", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it('delete one folder with correct id - S',(done)=>{
        FolderService.deleteOneFolderById(folders[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(String(value['_id'])).to.be.equal(String(folders[0]._id))
            done()
        })
    })
    it('check favorite inside folder correctly delete - S',(done)=>{
        FavoriteService.findManyFavorites(null, null, folders[0]._id, null, user._id, null, function(err, value){
            expect(value).to.be.a("object")
            expect(value).to.haveOwnProperty("count")
            expect(value["count"]).to.be.equal(0)
            done()
        })
    })
})
describe('deleteManyFolder',()=>{
    it('delete many folders with uncorrect user_id - E',(done)=>{
        FolderService.deleteManyFolder("jireojvoeir", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('delete many folders with missing user_id - E',(done)=>{
        FolderService.deleteManyFolder(null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('delete many folders with correct user_id not exist in database - E',(done)=>{
        FolderService.deleteManyFolder("66c478abc41f2aa9977ad3ea", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it('delete many folders with correct user_id - S',(done)=>{
        FolderService.deleteManyFolder(user._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).to.be.equal(1)
            done()
        })
    })
})
describe("delete user",() => {
    it("delete",(done)=>{
        UserService.deleteOneUser(user._id, null, function(err, value){
            expect(value).to.be.a("object")
            done()
        })
    })
})
