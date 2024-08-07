const chai = require('chai') 
const CommentService = require("../../services/CommentService").CommentServices
let expect = chai.expect

const comments = []

describe("AddOneComment",() => {
    it('Add one correct comment - S',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment("66b0dca10a74cd8a171aae0d","669f589f75435542ceef47ea",goodComment, null, function(err, value){
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
        CommentService.addOneComment("66b0dca10a","669f589f75435542ceef47ea",goodComment, null, function(err, value){
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
        CommentService.addOneComment(null,"669f589f75435542ceef47ea",goodComment, null, function(err, value){
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
        CommentService.addOneComment("66b0dca10a74cd8a171aae0d","669f589f754",goodComment, null, function(err, value){
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
        CommentService.addOneComment("66b0dca10a74cd8a171aae0d",null,goodComment, null, function(err, value){
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
        CommentService.addOneComment("66b0dca10a74cd8a171aae0d","669f589f75435542ceef47ea",goodComment, null, function(err, value){
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
        CommentService.addOneComment("66b0dca10a74cd8a171aae0d","669f589f75435542ceef47ea",goodComment, null, function(err, value){
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
        CommentService.addOneComment("66b0dca10a74cd8a171aae0d","669f589f75435542ceef47ea",goodComment, null, function(err, value){
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
        CommentService.addOneComment("66b0dca10a74cd8a171aae0d","669f589f75435542ceef47ea",goodComment, null, function(err, value){
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
        CommentService.findOneCommentById("66b0dca10a74cd8a171aae0d", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
})


describe("findManyCommentsByUserId  - S",()=>{
    it("find comments with good user ID",(done) => {
        CommentService.findManyCommentsByUserId("66b0dca10a74cd8a171aae0d",null, function(err,value){
            expect(value).to.haveOwnProperty('results')
            expect(value['results']).to.be.an('array')
            expect(value['results']).to.have.lengthOf.at.least(1)
            expect(value['results'][0]).to.be.a('object')
            expect(value['results'][0]).to.haveOwnProperty('user_id')
            expect(String(value['results'][0]['user_id'])).to.be.equal("66b0dca10a74cd8a171aae0d")
            done()
        })
    })
    it("find comments with uncorrect user ID - E",(done) => {
        CommentService.findManyCommentsByUserId("66b0dca10a74",null, function(err,value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("find comments with missing user ID - E",(done) => {
        CommentService.findManyCommentsByUserId(null,null, function(err,value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("find comments with correct user ID but not present in database - E",(done) => {
        CommentService.findManyCommentsByUserId("669f589f75435542ceef47ea",null, function(err,value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('count')
            expect(value["count"]).to.be.equal(0)
            done()
        })
    })
})