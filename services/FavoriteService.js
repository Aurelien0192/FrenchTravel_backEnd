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

    static findManyFavorites = async function(page, limit, placeOrFolder_id, user_id, option, callback){
        page = !page ? 1 : page
        limit = !limit ? 0 : limit
        page = !Number.isNaN(page) ? Number(page): page
        limit = !Number.isNaN(limit) ? Number(limit): limit

        if(user_id && mongoose.isValidObjectId(user_id)){
            if((placeOrFolder_id && mongoose.isValidObjectId(placeOrFolder_id)) || !placeOrFolder_id){
                const queryMongo = 
                {$and:[
                    {user: user_id},
                    placeOrFolder_id? {$or : _.map(["place","folder"], (e) => {return{[e]:new mongoose.Types.ObjectId(placeOrFolder_id)}})} : {}
                ]}
                if (Number.isNaN(page) || Number.isNaN(limit)){
                    callback ({msg: `format de ${Number.isNaN(page) ? "page" : "limit"} est incorrect`, type_error:"no-valid"})
                }else{
                    Favorite.countDocuments(queryMongo).then((value) => {
                        if (value > 0){
                            const skip = ((page-1) * limit)
                            Favorite.find(queryMongo, null, {skip:skip, limit:limit, populate:'place',lean:true}).then((results) => {
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
            }else{
                const err = ErrorGenerator.controlIntegrityofID(placeOrFolder_id)
                callback(err)
            }

        }else{
            const err = ErrorGenerator.controlIntegrityofID({user_id})
            callback(err)
        }
    }

    static updateOneFavorite = async function(favorite_id,update,options, callback){
        try{
            if(favorite_id && mongoose.isValidObjectId(favorite_id)){
                if(update && Object.keys(update).length>0){
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
                callback(err)
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
            callback(err)
        }
    }

    static deleteManyFavorites = async function(placeOrUser_id, options, callback){
        if(!Array.isArray(placeOrUser_id)){
            placeOrUser_id = [placeOrUser_id]
        }
        if(placeOrUser_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == placeOrUser_id.length){

            Favorite.deleteMany({$or:[{place:placeOrUser_id},{user:placeOrUser_id}]}).then((value)=>{
                if(value && value.deletedCount !== 0){
                    callback(null, value)
                }else{
                    callback({msg:"Aucun favoris trouvé", type_error:"no-found"})
                }
            }).catch((error)=>{
                callback({msg: "error in server", e, type_error:"error-mongo"})
            })

        }else{
            callback({msg: "les ids renseigner ne sont pas valid",type_error:"no-valid"})
        }
    }
}