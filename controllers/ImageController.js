const multer = require('../middlewares/multer.config')
const ImageService = require('../services/ImageService').ImageService

module.exports.ImageController = class ImageController{
    static async addOneImage(req, res){
        ImageService.addOneImage(req.file,req.body.place_id,function(err,value){
            if(err && err.type_error === "no-valid" || err.type_error === "validator"){
                res.statusCode = 405
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })  
    }

    static async addManyImages(req, res){
        ImageService.addManyImages(req.files,req.body.place_id,function(err,value){
            if(err && (err.type_error === "no-valid" || err[0].type_error === "validator")){
                res.statusCode = 405
                console.log(err)
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })  
    }
}