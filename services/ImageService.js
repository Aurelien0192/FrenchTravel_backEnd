const mongoose = require('mongoose')

const ImageSchema = require('../schemas/Image').ImageSchema

const Image = mongoose.model('Image',ImageSchema)

module.exports.ImageService = class ImageService{
    static async addOneImage(imageInfo, place_id, callback){
        try{

            if(!imageInfo){
                callback({msg: "no image get for upload", type_error: "no-valid"})
            }else{
                const path = imageInfo.path.split('\\').join('/')
                const image = new Image()
                image.name = imageInfo.filename
                image.place = place_id
                image.path = path
                
                let errors = image.validateSync()
                if(errors){
                    errors = errors['errors']
                    const text = Object.keys(errors).map((e) => {
                        return !errors[e].stringValue? errors[e]['properties']['message'] : `type ${errors[e]['valueType']} is not allowed in path ${errors[e]['path']}`
                    }).join (' ')
                    const fields = _.transform(Object.keys(errors), function (result, value) {
                        errors[value].properties ? result[value] = errors[value]['properties']['message'] : result[value] = ""
                    },{})

                    const err = {
                        msg: text,
                        fields_with_error: Object.keys(errors),
                        fields: fields,
                        type_error : "validator"
                    }
                    callback(err)

                }else{
                    await image.save()
                    callback(null, image.toObject()) 
                }
            }
        }catch(err){
            console.log(err)
            callback(err)
        }
    }
}