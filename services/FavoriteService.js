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

    static findManyFavorites = async function(page, limit, placeOrFolder_id, search, user_id, option, callback){
        page = !page ? 1 : page
        limit = !limit ? 10 : limit
        page = !Number.isNaN(page) ? Number(page): page
        limit = !Number.isNaN(limit) ? Number(limit): limit

        if(user_id && mongoose.isValidObjectId(user_id)){
            const aggregateOptions = [
                        {
                            $lookup:{
                                from: "places",
                                localField: "place",
                                foreignField: "_id",
                                as: "place"
                            }
                        },{
                            $unwind:{
                                path: "$place",
                                preserveNullAndEmptyArrays: true
                            }
                        },{
                            $lookup:{
                                from: "images",
                                localField: "place._id",
                                foreignField: "place",
                                pipeline: [{
                                    $limit: 1
                                }],
                                as: "place.images"
                            }
                        },{
                            $match:{
                                $and: [{
                                    user: user_id
                                },{
                                    "place.name": {
                                        $regex: search? search:"",
                                        $options: "i"
                                    }
                                }]
                            }
                        },{
                            $facet:{
                                count: [{
                                    $count: "count"
                                }],
                                results: [{
                                    $limit: limit
                                },{
                                    $skip: (page-1)*limit
                                }]
                            }
                        },{
                            $project:{
                                count: {
                                    $arrayElemAt: ["$count.count", 0]
                                },
                                results: 1  
                            }
                        }
                    ]
            if((placeOrFolder_id && mongoose.isValidObjectId(placeOrFolder_id)) || !placeOrFolder_id){ 
                if (placeOrFolder_id){
                    placeOrFolder_id = new mongoose.Types.ObjectId(placeOrFolder_id)
                    aggregateOptions[3].$match.$and.push({
                        $or: [{
                            folder: placeOrFolder_id
                        },{
                            "place._id": placeOrFolder_id
                        }]
                    })
                }
                if (Number.isNaN(page) || Number.isNaN(limit)){
                    callback ({msg: `format de ${Number.isNaN(page) ? "page" : "limit"} est incorrect`, type_error:"no-valid"})
                }else{
                    let favoritesFind = await Favorite.aggregate(aggregateOptions)
                    favoritesFind = favoritesFind[0]
                    console.log(favoritesFind)
                    callback(null, {
                        count : favoritesFind.count? favoritesFind.count : 0,
                        results : favoritesFind.results
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
                    Favorite.findByIdAndUpdate(favorite_id,{$unset:{folder: 1}},{returnDocument: 'after', runValidators: true}).then((value)=>{
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
                }
            }else{
                const err = ErrorGenerator.controlIntegrityofID({favorite_id})
                callback(err)
            }
        }catch(e){
            callback({msg: "error in server", e, type_error:"error-mongo"})
        }
    }

    static deleteOneFavorite = async function(placeOrFavorite_id, user_id, options, callback){
        if(user_id && mongoose.isValidObjectId(user_id) && placeOrFavorite_id && mongoose.isValidObjectId(placeOrFavorite_id)){
                Favorite.findOneAndDelete({$and:[{user:user_id},{$or:[{place:placeOrFavorite_id},{_id:placeOrFavorite_id}]}], }).then((value)=>{
                    if(value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg:"Aucun favoris trouvé", type_error:"no-found"})
                    }
                }).catch((error)=>{
                    callback({msg: "error in server", e, type_error:"error-mongo"})
                })

        }else{
            const err = ErrorGenerator.controlIntegrityofID({user_id, placeOrFavorite_id})
            callback(err)
        }
    }

    static deleteManyFavorites = async function(placeOrUserOrFolder_id, options, callback){
        if(!Array.isArray(placeOrUserOrFolder_id)){
            placeOrUserOrFolder_id = [placeOrUserOrFolder_id]
        }
        if(placeOrUserOrFolder_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == placeOrUserOrFolder_id.length){

            Favorite.deleteMany({$or:[{place:placeOrUserOrFolder_id},{user:placeOrUserOrFolder_id},{folder:placeOrUserOrFolder_id}]}).then((value)=>{
                if(value && value.deletedCount !== 0){
                    callback(null, value)
                }else{
                    callback({msg:"Aucun favoris trouvé", type_error:"no-found"})
                }
            }).catch((error)=>{
                console.log(error)
                callback({msg: "error in server", e, type_error:"error-mongo"})
            })

        }else{
            callback({msg: "les ids renseigner ne sont pas valid",type_error:"no-valid"})
        }
    }
}