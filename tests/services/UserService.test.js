const chai = require('chai') 
const UserService = require("../../services/UserService").UserService
const PlaceService = require("../../services/PlaceService").PlaceService
const ImageService = require("../../services/ImageService").ImageService
const CommentService = require("../../services/CommentService").CommentServices
const LikeCommentService = require("../../services/LikeCommentService").LikeCommentService
const FavoriteService = require("../../services/FavoriteService").FavoriteService
let expect = chai.expect

const users =[]
let place = {}
let image = {}
let comment = {}
let like = {}
let favorite = {}

describe("AddOneUser",()=> {
    
    it("Add user with good property - S",(done)=>{
        const goodUserUser ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"user",
        username:"EricLaDébrouille",
        password:"coucou",
        email:"eric.dupond@gmail.com"
    }
        UserService.addOneUser(goodUserUser, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('username')
            expect(value['username']).to.equal(goodUserUser.username)
            expect(err).to.be.null
            users.push(value)
            done()
        })
    })
    it("Add good place to good user -S",(done)=>{
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
        PlaceService.addOnePlace(goodHotel, users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('name')
            expect(String(value['name'])).to.be.equal("Château du Doubs")
            expect(err).to.be.null
            place={...value}
            done()
        })
    })
    it("add one image associated to place by first user - S",(done)=>{
        const correctImageInfo = {
            path: "\\data\\images\\superbePhoto.jpg",
            filename: "superbePhoto.jpg",
        }
        ImageService.addOneImage(correctImageInfo, place._id, users[0]._id, function(err,value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("_id")
            expect(value).to.haveOwnProperty("user_id")
            expect(String(value["user_id"])).to.be.equal(String(users[0]._id))
            image={...value}
            expect(err).to.be.null
            done()
        })
    })
    it('Add one correct comment - S',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment(users[0]._id,place._id,goodComment, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("note")
            expect(value["note"]).to.be.equal(5)
            expect(err).to.be.null
            comment = {...value}
            done()
        })
    })
    it(("add a like with correct user_id and comment_id - S"),(done)=>{
        LikeCommentService.addOneLikeOnComment(comment._id,users[0]._id, 0, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('user_id')
            expect(String(value['user_id'])).to.be.equal(String(users[0]._id))
            expect(value).to.haveOwnProperty('comment_id')
            expect(String(value['comment_id'])).to.be.equal(String(comment._id))
            like = {...value}
            done()
        })
    })
    it("add in favorite the place - S",(done)=>{
        FavoriteService.addOneFavorite(users[0]._id, place._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("user")
            expect(value).to.haveOwnProperty("place")
            expect(String(value["user"])).to.be.equal(String(users[0]._id))
            expect(String(value['place'])).to.be.equal(String(place._id))
            favorite = {...value} 
            done()
        
        })
    })
    it("Add user with supplementary property - S",(done)=>{
        const goodUserWithSuppProperty ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"user",
        username:"LaFéeDuLogie",
        password:"coucou",
        email:"peter.pan@gmail.com",
        batiment:"Rondoudou"
        
    }
        UserService.addOneUser(goodUserWithSuppProperty, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('username')
            expect(value['username']).to.equal(goodUserWithSuppProperty.username)
            expect(value).to.not.have.property('batiment')
            expect(err).to.be.null
            users.push(value)
            done()
        })
    })
    it("Add user with minimal property - S",(done)=>{
        const goodUserUserWithMinimalProperty ={
            firstName : "",
            lastName : "",
            userType:"user",
            username:"Jojo",
            password:"coucou",
            email:"jojodu25@gmail.com"
        }
        UserService.addOneUser(goodUserUserWithMinimalProperty, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('username')
            expect(value['username']).to.equal(goodUserUserWithMinimalProperty.username)
            expect(err).to.be.null
            users.push(value)
            done()
        })
    })
    it("Add user with duplicate username - E",(done)=>{
        const userWithDuplicateUserName ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"user",
        username:"EricLaDébrouille",
        password:"coucou",
        email:"eric.dupond3@gmail.com"
    }
        UserService.addOneUser(userWithDuplicateUserName, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('duplicate')
            expect(err).to.haveOwnProperty('fields_with_error')
            expect(err['fields_with_error'][0]).to.be.equal('username')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Add user with duplicate Email - E",(done)=>{
        const userWithDuplicateEmail ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"user",
        username:"EricLaDébrouille2",
        password:"coucou",
        email:"eric.dupond@gmail.com"
    }
        UserService.addOneUser(userWithDuplicateEmail, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('duplicate')
            expect(err).to.haveOwnProperty('fields_with_error')
            expect(err['fields_with_error'][0]).to.be.equal('email')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Add user with missing username - E",(done)=>{
        const badUserWithMissingusername ={
            firstName : "Eric",
            lastName : "Dupond",
            userType:"user",
            password:"coucou",
            email:"eric.dupond@gmail.com"
        }
        UserService.addOneUser(badUserWithMissingusername, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(err).to.haveOwnProperty('fields_with_error')
            expect(err['fields_with_error'][0]).to.be.equal('username')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Add professionnal with not good property - E",(done)=>{
        const ProfessionalWithoutName ={
            firstName : "",
            lastName : "",
            userType:"professional",
            username:"Santafe",
            password:"coucou",
            email:"SantaFe@gmail.com"
        }
        UserService.addOneUser(ProfessionalWithoutName, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(err).to.haveOwnProperty('fields_with_error')
            expect(err['fields_with_error'][0]).to.be.equal('firstName')
            expect(err['fields_with_error'][1]).to.be.equal('lastName')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Add professionnal with good property - S",(done)=>{
        const goodUserProfessional ={
            firstName : "Picsou",
            lastName : "Donald",
            userType:"professional",
            username:"LaGaffe",
            password:"coucou",
            email:"SantaFe@gmail.com"
        }
        UserService.addOneUser(goodUserProfessional, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('username')
            expect(value['username']).to.equal(goodUserProfessional.username)
            expect(err).to.be.null
            users.push(value)
            done()
        })
    })
})

describe("findOneUserById", () => {
    it("find user with good id",(done)=>{
        UserService.findOneUserById(users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('username')
            expect(value['username']).to.equal(users[0].username)
            expect(err).to.be.null
            done()
        })
    })
    it("find user with unexisting id",(done)=>{
        UserService.findOneUserById('66999181b8ed19f77af1660b', null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            expect(value).to.be.undefined
            done()
        })
    })
    it("find user with uncorrect id",(done)=>{
        UserService.findOneUserById('66999181b8e', null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
    it("find user with missing id",(done)=>{
        UserService.findOneUserById(null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
})

describe("UpdateOneUser",() => {
    it("modify user with correct information - S",(done)=> {
        UserService.updateOneUser(users[0]._id, {firstName:"Gaston"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('firstName')
            expect(value['firstName']).to.be.equal("Gaston")
            expect(err).to.be.null
            done()
        })
    })
    it("modify user to empty required property - E",(done)=> {
        UserService.updateOneUser(users[0]._id, {email:""}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(err).to.haveOwnProperty('msg')
            expect(err['msg']).to.include('email')
            expect(value).to.be.undefined
            done()
        })
    })
    it("modify user with unexisting id - E",(done)=> {
        UserService.updateOneUser('66999181b8ed19f77af1660b', {username:"lala"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            expect(value).to.be.undefined
            done()
        })
    })
    it("modify user with uncorrect id - E",(done)=> {
        UserService.updateOneUser('itsme', {username:"lala"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
    it("modify user with uncorrect property - S",(done)=> {
        UserService.updateOneUser(users[0]._id, {music:"Hellfest"}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).not.to.have.property("music")
            expect(err).to.be.null
            done()
        })
    })
    it("modify user with empty update - E",(done)=> {
        UserService.updateOneUser(users[0]._id, {}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('firstName')
            expect(value['firstName']).to.be.equal("Gaston")
            expect(err).to.be.null
            done()
        })
    })
    it("modify profile photo of user - E",(done)=> {
        UserService.updateOneUser(users[0]._id, {profilePhoto:"eziojergjorie"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-valid")
            expect(value).to.be.undefined
            done()
        })
    })
    it("modify user with null update - E",(done)=> {
        UserService.updateOneUser(users[0]._id, null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
    it("modify professional to empty firstName - E",(done)=> {
        UserService.updateOneUser(users[3]._id, {firstName:""}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
})


describe("DeleteOneUser",()=>{
    it("Delete user with unexist id - E",(done)=> {
        UserService.deleteOneUser('66999181b8ed19f77af1660b',null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Delete user with uncorrect id - E",(done)=> {
        UserService.deleteOneUser('hello',null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Delete with correct id and associated image - S",(done)=> {
        UserService.deleteOneUser(users[0]._id,null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('firstName')
            expect(value['firstName']).to.be.equal("Gaston")
            expect(err).to.be.null
            done()
        })
    })
    it('verify favorite correctly delete - S',(done) =>{
        FavoriteService.findManyFavorites(null, null, null, users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('count')
            expect(value["count"]).to.be.equal(0)
            expect(value).to.haveOwnProperty("results")
            expect(value['results']).to.lengthOf(0)
            users.splice(0,1)
            done()
        })
    })
    it("Delete user without associated place and image - S",(done)=>{
        UserService.deleteOneUser(users[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(String(value['_id'])).to.be.equal(String(users[0]._id))
            expect(err).to.be.null
            users.splice(0,1)
            done()
        })
    })
    it("verify image correctly deleted - S",(done) => {
        ImageService.findOneImageById(image._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it("verify place correctly delete - S",(done) =>{
        PlaceService.findOnePlaceById(place._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it("verify comment correctly delete - S",(done) =>{
        CommentService.findOneCommentById(comment._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it("verify like correctly delete - S",(done) =>{
        LikeCommentService.findOneLikeCommentById(like._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it("Delete user with good id - S",(done)=>{
        UserService.deleteOneUser(users[0]._id, null, function(err, value){ 
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(String(value['_id'])).to.be.equal(String(users[0]._id))
            expect(err).to.be.null
            users.splice(0,1)
            done()
        })  
    })
    it("Delete user with good id - S",(done)=>{
        UserService.deleteOneUser(users[0]._id, null, function(err, value){ 
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(String(value['_id'])).to.be.equal(String(users[0]._id))
            expect(err).to.be.null
            users.splice(0,1)
            done()
        })  
    })
})