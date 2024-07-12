const mongoose = require('mongoose')
const _ = require('lodash')

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
                        return !errors[e].stringValue? errors[e].properties.message : `type ${errors[e]['valueType']} is not allowed in path ${errors[e]['path']}`
                    }).join (' ')
                    const fields = _.transform(Object.keys(errors), function (result, value) {
                        errors[value].properties ? result[value] = errors[value].properties.message : result[value] = ""
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

    static async addManyImages(imagesInfo, place_id, callback){
        const errors = []

        if(!imagesInfo){
            callback({msg: "no image get for upload", type_error: "no-valid"})

        }else{
            const imageTab= []
            
            imagesInfo.forEach((imageInfo) => {
                const path = imageInfo.path.split('\\').join('/')
                const image = new Image()
                image.name = imageInfo.filename
                image.place = place_id
                image.path = path
                console.log(image)
                imageTab.push(image)
            });
            for(let i =0; i < imagesInfo.length; i++ ){
                let error = imageTab[i].validateSync()
                if(error){
                    error = error['errors']
                    const text = Object.keys(error).map((e) => {
                        console.log(error[e].properties)
                        error[e].properties.message
                    }).join (' ')
                    const fields = _.transform(Object.keys(error), function (result, value) {
                        console.log(value, result)
                        result[value] = error[value].properties.message
                    },{})
                    
                    errors.push({
                        msg: text,
                        fields_with_error: Object.keys(errors),
                        fields: fields,
                        type_error : "validator"
                    })
                }
            }

            if(errors.length > 0){
                callback(errors)
            }else{

                try{
                const data = await Image.insertMany(imageTab,{ordered: false})
                    callback(null, data) 
                
                }catch(err){
                    //console.log(err)
                    callback(err)
                }
            }
        }
    }
}