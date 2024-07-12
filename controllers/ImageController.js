const multer = require('../middlewares/multer.config')
const ImageService = require('../services/ImageService').ImageService

module.exports.ImageController = class ImageController{
    static async addOneImage(req, res){
        console.log(req.body)
        ImageService.addOneImage(req.file,req.body.place_id,function(err,value){
            if(err && err.type_error === "no-valid"){
                res.statusCode = 405
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })
        
    }
}