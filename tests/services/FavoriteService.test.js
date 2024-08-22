const chai = require('chai') 
const FavoriteService = require("../../services/FavoriteService").FavoriteService
const UserService = require('../../services/UserService').UserService
const PlaceService = require('../../services/PlaceService').PlaceService

let expect = chai.expect
const _ = require('lodash')

const favorites = []
const users = []
const places = []

describe('create user and place for test',() => {
    const goodUser ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"professional",
        username:"EricLaDébrouille",
        password:"coucou",
        email:"eric.dupond@gmail.com"
    }
    const anothergoodUser={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"professional",
        username:"EricLeFake",
        password:"coucou",
        email:"eric.leFake@gmail.com"
    }
    it("user creation",(done)=>{
        UserService.addOneUser(goodUser, null, function(err, value){
            users.push(value)
            done()
        })
    })
    it("another user creation",(done)=>{
        UserService.addOneUser(anothergoodUser, null, function(err, value){
            users.push(value)
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
        PlaceService.addOnePlace(goodHotel,users[0]._id, null, function(err, value){
            places.push(value)
            done()
        })
    })
    it('another place creation',(done)=>{
        const goodHotel = {
            name: "le palace",
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
        PlaceService.addOnePlace(goodHotel,users[1]._id, null, function(err, value){
            places.push(value)
            done()
        })
    })
})

describe("add one favorite",()=>{
    it('add one correct favorite - S',(done)=>{
        FavoriteService.addOneFavorite(users[0]._id, places[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("user")
            expect(value).to.haveOwnProperty("place")
            expect(String(value["user"])).to.be.equal(String(users[0]._id))
            expect(String(value['place'])).to.be.equal(String(places[0]._id))
            favorites.push(value)
            done()
        })
    })
    it('add one correct favorite in another place by user one - S',(done)=>{
        FavoriteService.addOneFavorite(users[0]._id, places[1]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("user")
            expect(value).to.haveOwnProperty("place")
            expect(String(value["user"])).to.be.equal(String(users[0]._id))
            expect(String(value['place'])).to.be.equal(String(places[1]._id))
            favorites.push(value)
            done()
        })
    })
    it('add one correct favorite in another place by user two - S',(done)=>{
        FavoriteService.addOneFavorite(users[1]._id, places[1]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("user")
            expect(value).to.haveOwnProperty("place")
            expect(String(value["user"])).to.be.equal(String(users[1]._id))
            expect(String(value['place'])).to.be.equal(String(places[1]._id))
            favorites.push(value)
            done()
        })
    })
    it('add one correct favorite but place already in favorite - E',(done)=>{
        FavoriteService.addOneFavorite(users[0]._id, places[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('add favorite but user id uncorrect- E',(done)=>{
        FavoriteService.addOneFavorite("fjorejog", places[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('add favorite but user id missing- E',(done)=>{
        FavoriteService.addOneFavorite(null, places[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('add favorite but place id uncorrect- E',(done)=>{
        FavoriteService.addOneFavorite(users[0]._id, "difvojdovs", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('add favorite but place id uncorrect- E',(done)=>{
        FavoriteService.addOneFavorite(users[0]._id, null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
})
describe('findManyFavorite',()=>{
    it("find many favorites by place id - S",(done)=>{
        FavoriteService.findManyFavorites(null, null, places[0]._id, null, users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('count')
            expect(value['count']).to.be.equal(1)
            expect(value).to.haveOwnProperty('results')
            expect(value['results']).to.be.an('array')
            expect(value['results']).to.lengthOf(1)
            expect(value['results'][0]).to.haveOwnProperty('user')
            expect(value['results'][0]).to.haveOwnProperty('place')
            expect(String(value['results'][0]['user'])).to.be.equal(String(users[0]._id))
            expect(value['results'][0]['place']).to.haveOwnProperty('_id')
            expect(String(value['results'][0]['place']['_id'])).to.be.equal(String(places[0]._id))
            done()
        })
    })
    it("find many favorites by search - S",(done)=>{
        FavoriteService.findManyFavorites(null, null, null, "le palace", users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('count')
            expect(value['count']).to.be.equal(1)
            expect(value).to.haveOwnProperty('results')
            expect(value['results']).to.be.an('array')
            expect(value['results']).to.lengthOf(1)
            expect(value['results'][0]).to.haveOwnProperty('user')
            expect(value['results'][0]).to.haveOwnProperty('place')
            expect(String(value['results'][0]['user'])).to.be.equal(String(users[0]._id))
            expect(value['results'][0]['place']).to.haveOwnProperty('name')
            expect(String(value['results'][0]['place']['name'])).to.be.equal("le palace")
            done()
        })
    })
    it("find many favorites without place id - S",(done)=>{
        FavoriteService.findManyFavorites(null, null, null, null, users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('count')
            expect(value['count']).to.be.equal(2)
            expect(value).to.haveOwnProperty('results')
            expect(value['results']).to.be.an('array')
            expect(value['results']).to.lengthOf(2)
            value.results.forEach((result)=>{
                expect(result).to.haveOwnProperty('user')
                expect(String(result['user'])).to.be.equal(String(users[0]._id))
            })
            done()
        })
    })
    it("find many favorite with uncorrect place id - E",(done) => {
        FavoriteService.findManyFavorites(null, null, "qsejojgoq", null, users[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("find many favorite with correct place id but not exist in database - S",(done) => {
        FavoriteService.findManyFavorites(null, null, users[1]._id, null, users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('count')
            expect(value["count"]).to.be.equal(0)
            expect(value).to.haveOwnProperty("results")
            expect(value['results']).to.lengthOf(0)
            done()
        })
    })
    it("find many favorite with correct place id but uncorrect user - E",(done) => {
        FavoriteService.findManyFavorites(null, null, places[0]._id, null, "kdfopjgop", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("find many favorite with correct place id but missing user - E",(done) => {
        FavoriteService.findManyFavorites(null, null, places[0]._id, null, null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
})
describe('updateOneFavorite',()=>{
    it("update one favorite with correct information - S",(done) =>{
        FavoriteService.updateOneFavorite(favorites[0]._id, {folder:users[0]._id}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('folder')
            expect(String(value['folder'])).to.be.equal(String(users[0]._id))
            done()
        })
    })
    it("update one favorite with supplementary unexpected field - S",(done) =>{
        FavoriteService.updateOneFavorite(favorites[0]._id, {visited:false,castor:"bois"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('visited')
            expect(value).to.not.haveOwnProperty('castor')
            expect(value['visited']).to.be.equal(false)
            done()
        })
    })
    it("update one favorite to delete folder - S",(done) =>{
        FavoriteService.updateOneFavorite(favorites[0]._id, null, null, function(err, value){
            console.log(err, value)
            expect(value).to.be.a('object')
            expect(value).to.not.haveOwnProperty('folder')
            done()
        })
    })
    it("update one favorite with uncorrect type on visited - E",(done) =>{
        FavoriteService.updateOneFavorite(favorites[0]._id, {visited:"feioeioiogje"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            done()
        })
    })
    it("update one favorite in immutable field - S",(done) =>{
        FavoriteService.updateOneFavorite(favorites[0]._id, {user:users[1]._id}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('user')
            expect(String(value['user'])).to.be.equal(String(users[0]._id))
            done()
        })
    })
    it("update one favorite with uncorrect favorite id - E",(done) =>{
        FavoriteService.updateOneFavorite("ferjiojro", {visited:true}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("update one favorite with missing favorite id - E",(done) =>{
        FavoriteService.updateOneFavorite(null, {visited:true}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("update one favorite with correct id but missing in database - E",(done) =>{
        FavoriteService.updateOneFavorite(users[0]._id, {visited:true}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})

describe("deleteOneFavorite",()=>{
    it ("delete one favorite but user_id is uncorrect - E",(done)=>{
        FavoriteService.deleteOneFavorite(places[0]._id, "sdviohjiq", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it ("delete one favorite but user_id is missing - E",(done)=>{
        FavoriteService.deleteOneFavorite(places[0]._id, null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it ("delete one favorite but place_id is uncorrect - E",(done)=>{
        FavoriteService.deleteOneFavorite("ijodvjdso", users[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it ("delete one favorite but place_id is missing - E",(done)=>{
        FavoriteService.deleteOneFavorite(null, users[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it ("delete one unexisting favorite - E",(done)=>{
        FavoriteService.deleteOneFavorite(places[0]._id, users[1]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it("delete one favorite with correct information - S",(done) => {
        FavoriteService.deleteOneFavorite(places[0]._id, users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("user")
            expect(value).to.haveOwnProperty("place")
            expect(String(value["user"])).to.be.equal(String(users[0]._id))
            expect(String(value['place'])).to.be.equal(String(places[0]._id))
            done()
        })
    })
})
describe("deleteManyFavorite",() => {
    it("delete many favorites with unexisting id - E", (done) => {
        FavoriteService.deleteManyFavorites(places[0]._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it("delete many favorites with uncorrect id - E", (done) => {
        FavoriteService.deleteManyFavorites("vdoivqj", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete many favorites with missing id - E", (done) => {
        FavoriteService.deleteManyFavorites(null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete many favorites by user id - S", (done) => {
        FavoriteService.deleteManyFavorites(users[1]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).to.be.equal(1)
            done()
        })
    })
    it("delete many favorites by place id - S", (done) => {
        FavoriteService.deleteManyFavorites(places[1]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('deletedCount')
            expect(value['deletedCount']).to.be.equal(1)
            done()
        })
    })
})
describe("delete users",() => {
    it("delete",(done)=>{
        UserService.deleteOneUser(users[0]._id, null, function(err, value){
            expect(value).to.be.a("object")
            done()
        })
    })
    it("delete",(done)=>{
        UserService.deleteOneUser(users[1]._id, null, function(err, value){
            expect(value).to.be.a("object")
            done()
        })
    })
})