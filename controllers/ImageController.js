const { default: mongoose } = require('mongoose')
const multer = require('../middlewares/multer.config')
const ImageService = require('../services/ImageService').ImageService
const responseOfServer = require('../utils/response').responseOfServer

module.exports.ImageController = class ImageController{
    static async addOneImage(req, res, next){
        req.log.info("Add one image in Database")
        ImageService.addOneImage(req.file, req.body.place_id, req.user._id,function(err,value){
            if(err && (err.type_error === "no-valid" || err.type_error === "validator")){
                res.statusCode = 405
                res.send(err)
            }else{
                if(req.url === "/image")
                {
                    res.statusCode = 201
                    res.send(value)
                }else{
                    res.locals.image = value
                    next()
                }
            }
        })  
    }

    static async addManyImages(req, res){
        req.log.info("Add many images in Database")
        ImageService.addManyImages(req.files,req.body.place_id, req.user._id,function(err,value){

            if(err && (err.type_error === "no-valid" || err[0].type_error === "validator")){
                res.statusCode = 405
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })  
    }

    static async findManyImagesByUserId(req, res){
        req.log.info("find many image by user ID")
        ImageService.findManyImagesByUserId(req.query.page, req.query.limit, req.user._id, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static async deleteOneImage(req, res, next){
        if(req.url === "/profilePhoto/user"){
            req.user.profilePhoto? req.params.id = req.user.profilePhoto._id : next()
        }
        if(String(req.params.id) === "66bcb4061788521df4dd381f"){
            next()
        }else{
            req.log.info("delete one image in Database")
            ImageService.deleteOneImage(req.params.id, function(err,value){
                if(err && (err.type_error === "no-valid")){
                    res.statusCode = 405
                    res.send(err)
                }else if(err && (err.type_error === "no-found")){
                    res.statusCode = 404
                    res.send(err)
                }else if(err && (err.type_error === "not-authorized")){
                    res.statusCode = 403
                    res.send(err)
                }else{
                    if(req.url === "/profilePhoto/user"){
                        next()
                    }else{
                        res.statusCode = 200
                        res.send(value)
                    }
                }
            })
        }
    }
}