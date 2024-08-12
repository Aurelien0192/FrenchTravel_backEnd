const mongoose = require('mongoose')
const ErrorGenerator = require('../utils/errorGenerator').errorGenerator
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const { errorGenerator } = require('../utils/errorGenerator')

const ImageSchema = require('../schemas/Image').ImageSchema

const Image = mongoose.model('Image',ImageSchema)

module.exports.ImageService = class ImageService{
    static async addOneImage(imageInfo, place_id, user_id, callback){
        if((!place_id || mongoose.isValidObjectId(place_id)) && user_id && mongoose.isValidObjectId(user_id)){
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
                        const err = ErrorGenerator.generateErrorSchemaValidator(errors)
                        callback(err)
                        
                    }else{
                        try{
                            const data = await image.save()
                            callback(null, data.toObject()) 
                        }catch(e){
                            callback(e)
                        }
                    }
                }
            }catch(err){
                callback(err)
            }
        }else{
            if(place_id && !mongoose.isValidObjectId(place_id)){
                callback({msg: "place_id is uncorrect",type_error:"no-valid"})
            }else{
                callback(ErrorGenerator.controlIntegrityofID({user_id}))
            }
        }
    }

    static async addManyImages(imagesInfo, place_id, user_id, callback){
        if (!Array.isArray(imagesInfo) && imagesInfo){
            imagesInfo = [imagesInfo]
        }
        const errors = []
        if((!place_id || mongoose.isValidObjectId(place_id)) && user_id && mongoose.isValidObjectId(user_id)){
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
        }else{
            if(place_id && !mongoose.isValidObjectId(place_id)){
                callback({msg: "place_id is uncorrect",type_error:"no-valid"})
            }else{
                callback(ErrorGenerator.controlIntegrityofID({user_id}))
            }
        }
    }

    static async findOneImageById(image_id, options, callback) {
        if(image_id && mongoose.isValidObjectId(image_id)){
            Image.findById(image_id).then((value) => {
                try{
                    if (value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg:"Aucune image trouvée", fields_with_error: [], fields:"", type_error: "no-found"})
                    }
                }catch(e){
                    console.log(e)
                    callback({msg: "Erreur avec la base de donnée", fields_with_error: [], fields:"", type_error:"error-mongo"})
                }
            }).catch((err) => {
                callback(err)
            })
        }else{
            callback({msg: "Id non conforme", fields_with_error: [], fields:"", type_error: "no-valid"})
        }
    }

        static findManyImagesByUserId = async function (page, limit, q, options, callback){
        if(q && mongoose.isValidObjectId(q)){
            const user_id = new mongoose.Types.ObjectId(q)

            page = !page ? 1 : page
            limit = !limit ? 7 : limit
            page = !Number.isNaN(page) ? Number(page): page
            limit = !Number.isNaN(limit) ? Number(limit): limit
            
            if (Number.isNaN(page) || Number.isNaN(limit)){
                callback ({msg: `format de ${Number.isNaN(page) ? "page" : "limit"} est incorrect`, type_error:"no-valid"})
            }else{
                Image.countDocuments({$and:[{user_id:user_id},{place:{$ne:null}}]}).then((value) => {
                    if (value > 0){
                        const skip = ((page-1) * limit)
                        Image.find({$and:[{user_id:user_id},{place:{$ne:null}}]}, null, {skip:skip, limit:limit}).then((results) => {
                            callback(null, {
                                count : value,
                                results : results
                            })
                        })
                    }else{
                        callback(null,{count : 0, results : []})
                    }
                }).catch((e) => {
                    callback(e)
                })
            }
        }
    }

    static async deleteOneImage(image_id, callback){
        if (image_id && mongoose.isValidObjectId(image_id)){ 
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
            if(!image_id){
                callback({msg:"Image ID is missing", type_error:'no-valid'})
            }else{
                callback({ msg: "Image ID invalid", type_error: 'no-valid' })
            }
        }
    }
    
    static async deleteManyImages(images_id, callback){
        if (images_id && Array.isArray(images_id) && images_id.length>0  && images_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == images_id.length){
            images_id = images_id.map((image) => {return new mongoose.Types.ObjectId(image)})
            Image.deleteMany({_id: images_id}).then((value) => {
                if (value && value.deletedCount !== 0){
                    callback(null, value)
                }else{
                    callback({msg: "Aucune images trouvées", type_error: "no-found"})
                }
            }).catch((err) => {
                callback({msg:"Erreur avec la base de donnée", type_error: "error-mongo"})
            })
        }
        else if (images_id && Array.isArray(images_id) && images_id.length > 0 && images_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != images_id.length) {
            callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: images_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
        }
        else if (images_id && !Array.isArray(images_id)) {
            callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

        }
        else {
            
            callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
        }
    }
}