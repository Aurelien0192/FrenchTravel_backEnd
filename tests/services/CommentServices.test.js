const chai = require('chai') 
const CommentService = require("../../services/CommentService").CommentServices
const UserService = require('../../services/UserService').UserService
const PlaceService = require('../../services/PlaceService').PlaceService
let expect = chai.expect
const _ = require('lodash')

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
})

describe("AddOneComment",() => {
    it('Add one correct comment - S',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
            note:5,
            dateVisited: new Date()
        }
        CommentService.addOneComment(user._id,place._id,goodComment, null, function(err, value){
            //console.log(value)
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("note")
            expect(value["note"]).to.be.equal(5)
            expect(err).to.be.null
            comments.push(value)
            done()
        })
    })
    it('check place correctly update - S',(done)=>{
        PlaceService.findOnePlaceById(place._id, null, function(err,value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("_id")
            expect(value).to.haveOwnProperty("numberOfNote")
            expect(value).to.haveOwnProperty("notation")
            expect(String(value["_id"])).to.be.equal(String(place._id))
            expect(value["numberOfNote"]).to.be.equal(1)
            expect(value["notation"]).to.be.equal(5)
            done()
        })
    })
    it('Add one correct comment with uncorrect user-id - E',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
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
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
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
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
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
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
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
    it('Add one comment with comment empty - E',(done) => {
        const goodComment = {
            comment:"",
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
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
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
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
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
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
    it('Add one comment with field note missing - E',(done) => {
        const goodComment = {
            comment:"superbe après-midi dans ce lieu",
            categorie:"hotel",
            numberOfNote:0,
            notation:0,
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
describe("addOnResponseComment",() => {
    it("add correct response to another comment but comment_id uncorrect - E",(done) => {
        CommentService.addOneResponseComment("blablabla", user._id,{comment: "merci pour ce commentaire"},null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('msg')
            expect(err["msg"]).to.be.equal("comment_id is uncorrect")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it("add correct response to another comment but comment_id missing - E",(done) => {
        CommentService.addOneResponseComment(null, user._id,{comment: "merci pour ce commentaire"},null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('msg')
            expect(err["msg"]).to.be.equal("comment_id is missing")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it("add correct response to another comment but comment_id missing in database - E",(done) => {
        CommentService.addOneResponseComment(user._id, user._id,{comment: "merci pour ce commentaire"},null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.be.equal("no-found")
            done()
        })
    })
    it("add correct response to another comment but user_id missing - E",(done) => {
        CommentService.addOneResponseComment(comments[0]._id, null,{comment: "merci pour ce commentaire"},null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('msg')
            expect(err["msg"]).to.be.equal("user_id is missing")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it("add correct response to another comment but user_id unccorrect - E",(done) => {
        CommentService.addOneResponseComment(comments[0]._id, "blablabla",{comment: "merci pour ce commentaire"},null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err).to.haveOwnProperty('msg')
            expect(err["msg"]).to.be.equal("user_id is uncorrect")
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it("add response to another comment with empty comment - E",(done) => {
        CommentService.addOneResponseComment(comments[0]._id, user._id,{comment: ""},null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.be.equal("validator")
            done()
        })
    })
    it("add response to another comment with missing comment - E",(done) => {
        CommentService.addOneResponseComment(comments[0]._id, user._id,null,null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.be.equal("no-valid")
            done()
        })
    })
    it("add correct response to comment - S",(done) => {
        CommentService.addOneResponseComment(comments[0]._id, user._id,{comment: "merci pour ce commentaire"},null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("user_id")
            expect(value).to.haveOwnProperty("isResponse")
            expect(value["isResponse"]).to.be.equal(true)
            expect(String(value["user_id"])).to.be.equal(String(user._id))
            expect(err).to.be.null
            comments.push(value)
            done()
        })
    })
    it("check id responseComment exist in comment - S",(done) => {
        CommentService.findOneCommentById(comments[0]._id, null, function (err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("response")
            expect(value['response']).to.be.a('object')
            expect(value['response']).to.haveOwnProperty('_id')
            expect(String(value['response']['_id'])).to.be.equal(String(comments[1]._id))
            done()
        })
    })
    it("try to respond another time to same comment - E",(done) => {
        CommentService.addOneResponseComment(comments[0]._id, user._id,{comment: "merci pour ce commentaire"},null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err["type_error"]).to.be.equal("unauthorized")
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
        CommentService.findManyComments(null, null, {user_id :user._id}, null, null, function(err,value){
            expect(value).to.haveOwnProperty('results')
            expect(value['results']).to.be.an('array')
            expect(value['results']).to.have.lengthOf.at.least(1)
            expect(value['results'][0]).to.be.a('object')
            expect(value['results'][0]).to.haveOwnProperty('user_id')
            value['results'].forEach((result) => {
                expect(result).to.haveOwnProperty("isResponse")
                expect(result["isResponse"]).to.be.equal(false)
            })
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
        CommentService.findManyComments(null, null, {place_id:place._id},"populateuser_id", null, function(err,value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('results')
            expect(value["results"]).to.be.an('Array')
            expect(value["results"]).to.have.lengthOf.at.least(1)
            expect(value["results"][0]).to.haveOwnProperty("_id")
            done()
        })
    })
    it("find comments with correct user ID with populate in place_id - S",(done) => {
        CommentService.findManyComments(null, null, {user_id:user._id},"populateplace_id", null, function(err,value){
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
     it('try update note with good id - E',(done)=>{
        CommentService.updateOneComment(comments[0]._id, {note:2}, null, function(err, value){
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
describe("deleteOneCommentByID",()=>{
    it("delete one comment with uncorrect ID - E",(done)=>{
        CommentService.deleteOneCommentById("qoijgogjro",function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete one comment with missing ID - E",(done)=>{
        CommentService.deleteOneCommentById(null,function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete one comment with correct ID but not exist in database - E",(done)=>{
        CommentService.deleteOneCommentById(user._id,function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            done()
        })
    })
    it("delete one comment with correct ID - E",(done)=>{
        CommentService.deleteOneCommentById(comments[0]._id,function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('_id')
            expect(String(value['_id'])).to.be.equal(String(comments[0]._id))
            done()
        })
    })
})

describe("deleteManyComments",() => {
    it("delete many comments with ID not in array - E",(done)=>{
        CommentService.deleteManyComments(comments[0]._id, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['msg']).to.be.equal("L'argument n'est pas un tableau.")
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete many comments with ID uncorrect - E",(done)=>{
        CommentService.deleteManyComments(["vjdfioojvojqojoq"], function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['msg']).to.be.equal("Tableau non conforme plusieurs éléments ne sont pas des ObjectId.")
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete many comments with ID missing - E",(done)=>{
        CommentService.deleteManyComments(null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['msg']).to.be.equal("Tableau non conforme.")
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete many comments with array of null - E",(done)=>{
        CommentService.deleteManyComments([null], function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('msg')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['msg']).to.be.equal("Tableau non conforme plusieurs éléments ne sont pas des ObjectId.")
            expect(err['type_error']).to.be.equal('no-valid')
            done()
        })
    })
    it("delete many comments with corrects ID - S",(done)=>{
        CommentService.deleteManyComments(_.map(comments,"_id"), function(err, value){
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