const chai = require('chai') 
const CommentService = require("../../services/CommentService").CommentServices
const UserService = require('../../services/UserService').UserService
const PlaceService = require('../../services/PlaceService').PlaceService
let expect = chai.expect

const comments = []
let user = {}
let place = {}

describe('create user and place for test',() => {
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
    it('place creation',()=>{
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
})

describe("AddOneComment",() => {
    it('Add one correct comment - S',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment(user._id,place._id,goodComment, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("note")
            expect(value["note"]).to.be.equal(5)
            expect(err).to.be.null
            comments.push(value)
            done()
        })
    })
    it('Add one correct comment with uncorrect user-id - E',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment("66b0dca10a",place._id,goodComment, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('msg')
            expect(err["msg"]).to.be.equal("user_id is uncorrect")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it('Add one correct comment with missing user-id - E',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment(null,place._id,goodComment, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('msg')
            expect(err["msg"]).to.be.equal("user_id is missing")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it('Add one correct comment with unccorrect place-id - E',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment(user._id,"669f589f754",goodComment, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('msg')
            expect(err["msg"]).to.be.equal("place_id is uncorrect")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it('Add one correct comment with missing place-id - E',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment(user._id,null,goodComment, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('msg')
            expect(err["msg"]).to.be.equal("place_id is missing")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it('Add one comment with comment empty - S',(done) => {
        const goodComment = {
            comment:"",
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment(user._id,place._id,goodComment, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("fields_with_error")
            expect(err['type_error']).to.be.equal("validator")
            expect(err["fields_with_error"][0]).to.be.equal("comment")
            done()
        })
    })
    it('Add one comment with note unccorrect - E',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:10,
            dateVisited: new Date()
        }
        CommentService.addOneComment(user._id,place._id,goodComment, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("fields_with_error")
            expect(err['type_error']).to.be.equal("validator")
            expect(err["fields_with_error"][0]).to.be.equal("note")
            done()
        })
    })
    it('Add one comment with dateVisited unccorrect format - E',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: "fsijoiejzo"
        }
        CommentService.addOneComment(user._id,place._id,goodComment, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("fields_with_error")
            expect(err['type_error']).to.be.equal("validator")
            expect(err["fields_with_error"][0]).to.be.equal("dateVisited")
            done()
        })
    })
    it('Add one comment with field note missing - S',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            dateVisited: new Date()
        }
        CommentService.addOneComment(user._id,place._id,goodComment, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("fields_with_error")
            expect(err['type_error']).to.be.equal("validator")
            expect(err["fields_with_error"][0]).to.be.equal("note")
            done()
        })
    })
})
describe("findCommentById",()=>{
    it('find comment with correct ID - S',(done)=>{
        CommentService.findOneCommentById(comments[0]._id, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(String(value['_id'])).to.be.equal(String(comments[0]._id))
            done()
        })
    })
    it('find comment with uncorrect ID - E',(done)=>{
        CommentService.findOneCommentById("comments[0]._id", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('find comment with missing ID - E',(done)=>{
        CommentService.findOneCommentById(null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it('find comment with correct ID but not exist in database - E',(done)=>{
        CommentService.findOneCommentById(user._id, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})


describe("findManyComments  - S",()=>{
    it("find comments with good user ID",(done) => {
        CommentService.findManyComments(null, null, {user_id :user._id},null, null, function(err,value){
            expect(value).to.haveOwnProperty('results')
            expect(value['results']).to.be.an('array')
            expect(value['results']).to.have.lengthOf.at.least(1)
            expect(value['results'][0]).to.be.a('object')
            expect(value['results'][0]).to.haveOwnProperty('user_id')
            expect(String(value['results'][0]['user_id'])).to.be.equal(String(user._id))
            done()
        })
    })
    it("find comments with uncorrect user ID - E",(done) => {
        CommentService.findManyComments(null, null, {user_id:"66b0dca10a74"}, null, null, function(err,value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("find comments with missing user ID - E",(done) => {
        CommentService.findManyComments(null, null, {user_id:null}, null, null, function(err,value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("find comments with missing query - E",(done) => {
        CommentService.findManyComments(null, null, null, null, null, function(err,value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("find comments with correct user ID but not present in database - S",(done) => {
        CommentService.findManyComments(null, null, {user_id:place._id}, null, null, function(err,value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('count')
            expect(value["count"]).to.be.equal(0)
            done()
        })
    })
    it("find comments with correct place ID - S",(done) => {
        CommentService.findManyComments(null, null, {place_id:place._id}, null, null, function(err,value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value["results"]).to.have.lengthOf.at.least(1)
            done()
        })
    })
    it("find comments with correct place ID with populate in user_id - S",(done) => {
        CommentService.findManyComments(null, null, {place_id:place._id}, null,"populateuser_id", function(err,value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value["results"]).to.be.an('Array')
            expect(value["results"]).to.have.lengthOf.at.least(1)
            expect(value["results"][0]).to.haveOwnProperty("_id")
            done()
        })
    })
    it("find comments with correct user ID with populate in place_id - S",(done) => {
        CommentService.findManyComments(null, null, {user_id:user._id}, null,"populateplace_id", function(err,value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value["results"]).to.be.an('Array')
            expect(value["results"]).to.have.lengthOf.at.least(1)
            expect(value["results"][0]).to.haveOwnProperty("_id")
            done()
        })
    })
})

describe("updateOneComment",()=>{
    it('update one comment with good comment_id - S',(done)=>{
        CommentService.updateOneComment(comments[0]._id, {like:1}, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('like')
            expect(value['like']).to.be.equal(1)
            done()
        })
    })
    it('update one comment with good id but uncorrect type of like - E',(done)=>{
        CommentService.updateOneComment(comments[0]._id, {like:"todoo"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("validator")
            done()
        })
    })
    it('update one comment with good id but empty comment field - E',(done)=>{
        CommentService.updateOneComment(comments[0]._id, {comment:""}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("validator")
            done()
        })
    })
    it('update one comment with good id but missing update - E',(done)=>{
        CommentService.updateOneComment(comments[0]._id, null, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-valid")
            done()
        })
    })
    it('update one comment with uncorrect id  - E',(done)=>{
        CommentService.updateOneComment("efzezfefz", {like:2}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-valid")
            done()
        })
    })
    it('update one comment with missing id  - E',(done)=>{
        CommentService.updateOneComment(null, {like:2}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-valid")
            done()
        })
    })
    it('update one comment with correct id but not exist in database - E',(done)=>{
        CommentService.updateOneComment(user._id, {comment:"hello"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal("no-found")
            done()
        })
    })
})

describe("delete user",() => {
    it("delete",(done)=>{
        UserService.deleteOneUser(user._id, null, function(err, value){
            done()
        })
    })
})