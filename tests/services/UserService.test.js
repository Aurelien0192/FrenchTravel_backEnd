const chai = require('chai') 
const UserService = require("../../services/UserService").UserService;
let expect = chai.expect

const users =[]

describe("AddOneUser",()=> {
    
    it("Add user with good property - S",(done)=>{
        const goodUserUser ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"user",
        userName:"EricLaDébrouille",
        password:"coucou",
        email:"eric.dupond@gmail.com"
    }
        UserService.addOneUser(goodUserUser, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('userName')
            expect(value['userName']).to.equal(goodUserUser.userName)
            expect(err).to.be.null
            users.push(value)
            done()
        })
    })
    it("Add user with supplementary property - S",(done)=>{
        const goodUserWithSuppProperty ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"user",
        userName:"LaFéeDuLogie",
        password:"coucou",
        email:"peter.pan@gmail.com",
        batiment:"Rondoudou"
        
    }
        UserService.addOneUser(goodUserWithSuppProperty, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('userName')
            expect(value['userName']).to.equal(goodUserWithSuppProperty.userName)
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
            userName:"Jojo",
            password:"coucou",
            email:"jojodu25@gmail.com"
        }
        UserService.addOneUser(goodUserUserWithMinimalProperty, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('userName')
            expect(value['userName']).to.equal(goodUserUserWithMinimalProperty.userName)
            expect(err).to.be.null
            users.push(value)
            done()
        })
    })
    it("Add user with duplicate userName - E",(done)=>{
        const userWithDuplicateUserName ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"user",
        userName:"EricLaDébrouille",
        password:"coucou",
        email:"eric.dupond3@gmail.com"
    }
        UserService.addOneUser(userWithDuplicateUserName, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('duplicate')
            expect(err).to.haveOwnProperty('fields_with_error')
            expect(err['fields_with_error'][0]).to.be.equal('userName')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Add user with duplicate Email - E",(done)=>{
        const userWithDuplicateEmail ={
        firstName : "Eric",
        lastName : "Dupond",
        userType:"user",
        userName:"EricLaDébrouille2",
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
    it("Add user with missing userName - E",(done)=>{
        const badUserWithMissinguserName ={
            firstName : "Eric",
            lastName : "Dupond",
            userType:"user",
            password:"coucou",
            email:"eric.dupond@gmail.com"
        }
        UserService.addOneUser(badUserWithMissinguserName, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('validator')
            expect(err).to.haveOwnProperty('fields_with_error')
            expect(err['fields_with_error'][0]).to.be.equal('userName')
            expect(value).to.be.undefined
            done()
        })
    })
    it("Add professionnal with not good property - E",(done)=>{
        const ProfessionalWithoutName ={
            firstName : "",
            lastName : "",
            userType:"professional",
            userName:"Santafe",
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
            userName:"LaGaffe",
            password:"coucou",
            email:"SantaFe@gmail.com"
        }
        UserService.addOneUser(goodUserProfessional, null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('userName')
            expect(value['userName']).to.equal(goodUserProfessional.userName)
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
            expect(value).to.haveOwnProperty('userName')
            expect(value['userName']).to.equal(users[0].userName)
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
        UserService.updateOneUser('66999181b8ed19f77af1660b', {userName:"lala"}, null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty('type_error')
            expect(err['type_error']).to.be.equal('no-found')
            expect(value).to.be.undefined
            done()
        })
    })
    it("modify user with uncorrect id - E",(done)=> {
        UserService.updateOneUser('itsme', {userName:"lala"}, null, function(err, value){
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
    it("Delete with correct id - S",(done)=> {
        UserService.deleteOneUser(users[0]._id,null, function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty('firstName')
            expect(value['firstName']).to.be.equal("Gaston")
            expect(err).to.be.null
            users.splice(0,1)
            done()
        })
    })
    it("Delete user with good id - S",(done)=>{
        users.forEach((e) => {
            UserService.deleteOneUser(e._id, null, function(err, value){ 
            })
        })
        done()
    })

})