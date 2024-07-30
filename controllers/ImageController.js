const multer = require('../middlewares/multer.config')
const ImageService = require('../services/ImageService').ImageService

module.exports.ImageController = class ImageController{
/**
 * @swagger
 * /image:
 *  post:
 *      summary: Uploads one Image
 *      description: Post one image about a place
 *      tags:
 *          - Image
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *          - in: formData
 *            name: image
 *            type: file
 *            description: The file to upload
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          place_id:
 *                            type: string
 *                          user_id:
 *                            type: string
 *      responses:
 *          201:
 *              description: Image successfully upload.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Image'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

    static async addOneImage(req, res){
        ImageService.addOneImage(req.body.image,req.body.place_id, req.user._id,function(err,value){
            if(err && err.type_error === "no-valid" || err.type_error === "validator"){
                res.statusCode = 405
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })  
    }

/**
 * @swagger
 * /images:
 *  post:
 *      summary: upload many Images
 *      description: Post many images about a place
 *      tags:
 *          - Image
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *          - in: formData
 *            name: images
 *            type: array
 *            items :
 *                  type : file
 *                  description: The file to upload
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          place_id:
 *                            type: string
 *                          user_id:
 *                            type: string
 *      responses:
 *          201:
 *              description: Image successfully upload.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Image'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

    static async addManyImages(req, res){
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
}