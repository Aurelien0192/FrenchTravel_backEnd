const chai = require('chai') 
const ImageService = require("../../services/ImageService").ImageService
let expect = chai.expect

const images = []

describe("addOneImage",() => {
    it("add a correct image - S",(done) => {
        const correctImageInfo = {
            path: "\\data\\images\\superbePhoto.jpg",
            filename: "superbePhoto.jpg",
        }
        ImageService.addOneImage(correctImageInfo,"66a75cb3772e3b975afa3eaa","669f545475435542ceef47e6",function (err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("_id")
            expect(value).to.haveOwnProperty("place")
            expect(value).to.haveOwnProperty("user_id")
            expect(String(value['place'])).to.be.equal("66a75cb3772e3b975afa3eaa")
            expect(String(value["user_id"])).to.be.equal("669f545475435542ceef47e6")
            images.push(value)
            expect(err).to.be.null
            done()
        })
    })
    it("add a correct image without place ID- S",(done) => {
        const correctImageInfo = {
            path: "\\data\\images\\superbePhoto.jpg",
            filename: "superbePhoto.jpg",
        }
        ImageService.addOneImage(correctImageInfo,null,"669f545475435542ceef47e6",function (err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("_id")
            expect(value).to.haveOwnProperty("user_id")
            expect(String(value["user_id"])).to.be.equal("669f545475435542ceef47e6")
            expect(err).to.be.null
            done()
        })
    })
    it("add a correct image without place ID and user_id missing - E",(done) => {
        const correctImageInfo = {
            path: "\\data\\images\\superbePhoto.jpg",
            filename: "superbePhoto.jpg",
        }
        ImageService.addOneImage(correctImageInfo,null,null,function (err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("msg")
            expect(err['type_error']).to.be.equal("no-valid")
            expect(err['msg']).to.be.equal("user_id is missing")
            expect(value).to.be.undefined
            done()
        })
    })
    it("add a correct image without place ID and user_id uncorrect - E",(done) => {
        const correctImageInfo = {
            path: "\\data\\images\\superbePhoto.jpg",
            filename: "superbePhoto.jpg",
        }
        ImageService.addOneImage(correctImageInfo,null,"fjifezzfe",function (err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("msg")
            expect(err['type_error']).to.be.equal("no-valid")
            expect(err['msg']).to.be.equal("user_id is uncorrect")
            expect(value).to.be.undefined
            done()
        })
    })
    it("add a correct image without place ID and place_id uncorrect - E",(done) => {
        const correctImageInfo = {
            path: "\\data\\images\\superbePhoto.jpg",
            filename: "superbePhoto.jpg",
        }
        ImageService.addOneImage(correctImageInfo,"dsjfefz","669f545475435542ceef47e6",function (err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("msg")
            expect(err['type_error']).to.be.equal("no-valid")
            expect(err['msg']).to.be.equal("place_id is uncorrect")
            expect(value).to.be.undefined
            done()
        })
    })
    it("add image without image - E",(done) => {
        ImageService.addOneImage(null,null,"669f545475435542ceef47e6",function (err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("msg")
            expect(err['type_error']).to.be.equal("no-valid")
            expect(err['msg']).to.be.equal("no image get for upload")
            expect(value).to.be.undefined
            done()
        })
    })
})
describe("AddManyImages",() => {
    it("add many valids images - S", (done) => {
        const validTabImages=[
            {
                path: "\\data\\images\\superbePhoto.jpg",
                filename: "superbePhoto.jpg" 
            },{
                path: "\\data\\images\\superbePhoto2.jpg",
                filename: "superbePhoto2.jpg",
            }
        ]
        ImageService.addManyImages(validTabImages, "66a75cb3772e3b975afa3eaa", "669f545475435542ceef47e6", function(err, value){
            expect(value).to.be.a('array')
            expect(value).lengthOf(2)
            expect(err).to.be.null
            done()
        })
    })
    it("add many valids images without place ID - S", (done) => {
        const validTabImages=[
            {
                path: "\\data\\images\\superbePhoto.jpg",
                filename: "superbePhoto.jpg" 
            },{
                path: "\\data\\images\\superbePhoto2.jpg",
                filename: "superbePhoto2.jpg",
            }
        ]
        ImageService.addManyImages(validTabImages, null, "669f545475435542ceef47e6", function(err, value){
            expect(value).to.be.a('array')
            expect(value).lengthOf(2)
            expect(err).to.be.null
            done()
        })
    })
    it("add many valids images without user_id - E", (done) => {
        const validTabImages=[
            {
                path: "\\data\\images\\superbePhoto.jpg",
                filename: "superbePhoto.jpg" 
            },{
                path: "\\data\\images\\superbePhoto2.jpg",
                filename: "superbePhoto2.jpg",
            }
        ]
        ImageService.addManyImages(validTabImages, "66a75cb3772e3b975afa3eaa", null, function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("msg")
            expect(err['type_error']).to.be.equal("no-valid")
            expect(err['msg']).to.be.equal("user_id is missing")
            expect(value).to.be.undefined
            done()
        })
    })
    it("add many valids images with user_id uncorrect - E", (done) => {
        const validTabImages=[
            {
                path: "\\data\\images\\superbePhoto.jpg",
                filename: "superbePhoto.jpg" 
            },{
                path: "\\data\\images\\superbePhoto2.jpg",
                filename: "superbePhoto2.jpg",
            }
        ]
        ImageService.addManyImages(validTabImages, "66a75cb3772e3b975afa3eaa", "sdviogj", function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("msg")
            expect(err['type_error']).to.be.equal("no-valid")
            expect(err['msg']).to.be.equal("user_id is uncorrect")
            expect(value).to.be.undefined
            done()
        })
    })
    it("add image without image - E",(done) => {
        ImageService.addManyImages(null,"66a75cb3772e3b975afa3eaa","669f545475435542ceef47e6",function (err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err).to.haveOwnProperty("msg")
            expect(err['type_error']).to.be.equal("no-valid")
            expect(err['msg']).to.be.equal("no image get for upload")
            expect(value).to.be.undefined
            done()
        })
    })
})
describe("findManyImages",() => {
    it("find many image with correct ID - S",(done)=>{
        ImageService.findManyImagesByUserId(1,10,"669f545475435542ceef47e6", null,function(err, value){
            done()
        })
    })
})
describe("deleteOneImages",() => {
    it("delete one image with correct ID - S ", (done) => {
        ImageService.deleteOneImage(images[0]._id,function(err, value){
            expect(value).to.be.a('object')
            expect(value).to.haveOwnProperty("_id")
            expect(String(value._id)).to.be.equal(String(images[0]._id))
            expect(err).to.be.null
            done()
        })
    })
    it("delete one image with uncorrect ID - E ", (done) => {
        ImageService.deleteOneImage("dfjlgd",function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal('no-valid')
            expect(err).to.haveOwnProperty("msg")
            expect(err["msg"]).to.be.equal("Image ID invalid")
            expect(value).to.be.undefined
            done()
        })
    })
    it("delete one image with missing ID - E ", (done) => {
        ImageService.deleteOneImage(null,function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal('no-valid')
            expect(err).to.haveOwnProperty("msg")
            expect(err["msg"]).to.be.equal("Image ID is missing")
            expect(value).to.be.undefined
            done()
        })
    })
    it("delete one image with correct ID but not exist - E ", (done) => {
        ImageService.deleteOneImage("66a75cb3772e3b975afa3eaa",function(err, value){
            expect(err).to.be.a('object')
            expect(err).to.haveOwnProperty("type_error")
            expect(err["type_error"]).to.be.equal('no-found')
            expect(err).to.haveOwnProperty("msg")
            expect(err["msg"]).to.be.equal("image non trouvée")
            expect(value).to.be.undefined
            done()
        })
    })
})