const mongoose = require('mongoose')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const ImageSchema = require('../schemas/Image').ImageSchema

const Image = mongoose.model('Image',ImageSchema)

module.exports.ImageService = class ImageService{
    static async addOneImage(imageInfo, place_id, user_id, callback){
        if(!mongoose.isValidObjectId(user_id)){
            if(!user_id){
                return callback({msg:"user_id is missing", type_error:"no-valid"})
            }else{
                return callback({msg:"user_id is uncorrect", type_error:"no-valid"})
            } 
        }
        if(!mongoose.isValidObjectId(place_id) && place_id){
            return callback({msg:"place_id is uncorrect", type_error:"no-valid"})  
        }
        try{
            if(!imageInfo){
                callback({msg: "no image get for upload", type_error: "no-valid"})
            }else{
                const path = imageInfo.path.split('\\').join('/')
                const image = new Image()
                image.name = imageInfo.filename
                if(place_id){
                    image.place = place_id
                }
                image.path = path
                image.user_id = user_id
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
                    try{
                        const data = await image.save()
                        callback(null, data.toObject()) 
                    }catch(e){
                        console.log(e)
                        callback(e)
                    }
                }
            }
        }catch(err){
            callback(err)
        }
    }

    static async addManyImages(imagesInfo, place_id, user_id, callback){
        if (!Array.isArray(imagesInfo) && imagesInfo){
            imagesInfo = [imagesInfo]
        }
        const errors = []
        if(!mongoose.isValidObjectId(user_id)){
            if(!user_id){
                return callback({msg:"user_id is missing", type_error:"no-valid"})
            }else{
                return callback({msg:"user_id is uncorrect", type_error:"no-valid"})
            } 
        }
        if(!mongoose.isValidObjectId(place_id) && place_id){
            return callback({msg:"place_id is uncorrect", type_error:"no-valid"})  
        }
        if(!imagesInfo){
            callback({msg: "no image get for upload", type_error: "no-valid"})

        }else{
            const imageTab= []
            
            imagesInfo.forEach((imageInfo) => {
                const path = imageInfo.path.split('\\').join('/')
                const image = new Image()
                image.name = imageInfo.filename
                if(place_id){
                    image.place = place_id
                }
                image.user_id = user_id
                image.path = path
                imageTab.push(image)
            });
            for(let i =0; i < imagesInfo.length; i++ ){
                let error = imageTab[i].validateSync()
                if(error){
                    error = error['errors']
                    const text = Object.keys(error).map((e) => {
                        error[e].properties.message
                    }).join (' ')
                    const fields = _.transform(Object.keys(error), function (result, value) {
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
                    callback(err)
                }
            }
        }
    }

    static async deleteOneImage(image_id, callback){
        if (image_id && mongoose.isValidObjectId(image_id)){
            if(image_id !== "66aa65e3841371a1955939dc"){
                Image.findByIdAndDelete(image_id).then((value) => {
                    try{
                        if(value){
                            callback(null, value.toObject())
                            fs.unlink(value.path,function(err){
                                if(err){
                                    console.log("echec de la suppression de l'image")
                                }else{
                                    console.log("réussite de la suppression")
                                }
                            })
                        }else{
                            callback({ msg: "image non trouvée", type_error: "no-found" })
                        }
                    }catch(e){
                        callback(e)
                    }
                }).catch((e) => {
                    callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
                })
            }else{
                callback(null,{msg:"image non supprimée"})
            }
        }else{
            if(!image_id){
                callback({msg:"Image ID is missing", type_error:'no-valid'})
            }else{
                callback({ msg: "Image ID invalid", type_error: 'no-valid' })
            }
        }
    }
}