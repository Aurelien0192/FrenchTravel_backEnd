const FavoriteSchema = require('../schemas/Favorite').FavoriteSchema
const _ = require('lodash')
const ErrorGenerator = require('../utils/errorGenerator').errorGenerator
const mongoose = require('mongoose')

const Favorite = mongoose.model('Favorite',FavoriteSchema)

module.exports.FavoriteService = class FavoriteService{
    static addOneFavorite = async function(user_id, place_id, options, callback){
        try{
            if(user_id && mongoose.isValidObjectId(user_id) && place_id && mongoose.isValidObjectId(place_id)){
                const new_favorite = new Favorite({
                    user: user_id,
                    place: place_id,
                })
                let errors = new_favorite.validateSync()
                if(errors){
                    let err = ErrorGenerator.generateErrorSchemaValidator(errors)
                    callback(err)
                }else{
                    await new_favorite.save()
                    callback(null, new_favorite.toObject())
                }
            }else{
                const err = ErrorGenerator.controlIntegrityofID({user_id, place_id})
                callback({msg : err, type_error:"no-valid"})
            }
        }catch(e){
            if(e.code === 11000){
                callback({msg:"vous avez déjà ce lieu en favoris", type_error:"no-valid"})
            }else{
                callback({msg: "error in server", e, type_error:"error-mongo"})
            }
        }
    }

    static updateOneFavorite = async function(favorite_id,update,options, callback){
        try{
            if(favorite_id && mongoose.isValidObjectId(favorite_id)){
                if(update){
                    Favorite.findByIdAndUpdate(favorite_id,update,{returnDocument: 'after', runValidators: true}).then((value)=>{
                        try{
                            if(value){
                                callback(null, value.toObject())
                            }else{
                                callback({msg: "Favoris non trouvée", fields_with_error: [], fields:"", type_error:"no-found"})
                            }
                        }catch(e){
                            callback({msg: "Erreur avec la base de données", fields_with_error: [], fields:"", type_error:"error-mongo"})
                        }
                    }).catch((errors) => {
                        const err = ErrorGenerator.generateErrorSchemaValidator(errors)
                            callback(err)
                    })
                }else{
                    callback({msg: "update is missing", type_error:"no-valid"})
                }
            }else{
                const err = ErrorGenerator.controlIntegrityofID({favorite_id})
                callback({msg : err, type_error:"no-valid"})
            }
        }catch(e){
            callback({msg: "error in server", e, type_error:"error-mongo"})
        }
    }

    static deleteOneFavorite = async function(place_id, user_id, options, callback){
        if(user_id && mongoose.isValidObjectId(user_id) && place_id && mongoose.isValidObjectId(place_id)){
                Favorite.findOneAndDelete({place:place_id, user:user_id}).then((value)=>{
                    if(value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg:"Aucun favoris trouvé", type_error:"no-found"})
                    }
                }).catch((error)=>{
                    callback({msg: "error in server", e, type_error:"error-mongo"})
                })

        }else{
            const err = ErrorGenerator.controlIntegrityofID({user_id, place_id})
            callback({msg : err, type_error:"no-valid"})
        }
    }

    static deleteManyFavorites = async function(placeOrUser_id, options, callback){
        if(placeOrUser_id && mongoose.isValidObjectId(placeOrUser_id)){
                Favorite.deleteMany({$or:[{place:placeOrUser_id}, {user:placeOrUser_id}]}).then((value)=>{
                    if(value && value.deletedCount !== 0){
                        callback(null, value)
                    }else{
                        callback({msg:"Aucun favoris trouvé", type_error:"no-found"})
                    }
                }).catch((error)=>{
                    callback({msg: "error in server", e, type_error:"error-mongo"})
                })

        }else{
            const err = ErrorGenerator.controlIntegrityofID({placeOrUser_id})
            callback({msg : err, type_error:"no-valid"})
        }
    }
}