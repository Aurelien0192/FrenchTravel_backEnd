const PlaceSchema = require ("../schemas/Place").PlaceSchema
const ImageService = require("../services/ImageService").ImageService
const ErrorGenerator = require('../utils/errorGenerator').errorGenerator
const DependencyService = require('../utils/dependencyServices').dependencyService
const { log } = require("async");
const _ = require('lodash')
const mongoose = require('mongoose');


PlaceSchema.set('toJSON',{virtuals:true})
PlaceSchema.set('toObject',{virtuals:true})

const Place = mongoose.model('Place', PlaceSchema)
module.exports.PlaceService =  class PlaceService{

    static addOnePlace = async function (place, user_id, options, callback){
        
        try{
            if(!place){
                callback({msg:"body is missing", type_error:"no-valid"})

            }else{
                const new_place = new Place(place)
                new_place.owner = user_id
                let errors = new_place.validateSync()
                if(errors){
                    let err = ErrorGenerator.generateErrorSchemaValidator(errors)
                    if(err.fields_with_error.includes("moreInfo.price")){
                        err.fields_with_error[_.findIndex(err.fields_with_error,(e)=>{return e ==="moreInfo.price"})] = ["price1","price2"]
                        err.fields_with_error= _.flatten(err.fields_with_error)
                    }
                    callback(err)
                }else{
                    if(new_place.categorie=== "restaurant" && new_place.moreInfo.price && new_place.moreInfo.price[1] < new_place.moreInfo.price[0]){
                        callback({
                            msg: "le deuxième prix ne peut être inférieur au premier prix",
                            fields_with_error: ["price1","price2"],
                            fieds : "",
                            type_error : "no-valid"
                        })
                    }else{
                        new_place.notation = 0
                        new_place.numberOfNote = 0
                        await new_place.save()
                        callback(null, new_place.toObject())
                    }
                
                }
            }
        }catch(error){
            if(error.code = 11000){
                const err = ErrorGenerator.generateErrorOfDuplicate(error)
                callback(err)
            }
            callback(error)
        }
    }

    static findOnePlaceById = function (place_id, options, callback){
        const opts = {populate : options && options.populate ? ['images',{
                        path:'comments',
                        perDocumentLimit:1,
                        options:{
                            sort: {
                                like : -1
                            }
                        },
                        populate:{
                            path: "user_id",
                            select: "-password -token -email -firstName -lastName -userType -about -create_at -update_at",
                            populate:{
                                path:"profilePhoto"
                            }
                        }
                    }]:[], lean:true}
        if(place_id && mongoose.isValidObjectId(place_id)){
            Place.findById(place_id, null, opts).then((value) => {
                try{
                    if (value){
                        callback(null, value)
                    }else{
                        callback({msg: "Aucun lieu trouvé", type_error: "no-found"})
                    }
                }catch(e){
                    callback({msg: "Erreur avec la base de donnée", fields_with_error: [], fields:"", type_error:"error-mongo"})
                }
            }).catch((err) => {
                callback(err)
            })
        }else{
            callback({ msg: "ObjectId non conforme.", type_error: 'no-valid' });
        }
    }

    static findManyPlacesById = function (places_id, options, callback){
        if(places_id && Array.isArray(places_id) && places_id.length>0  && places_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == places_id.length){
            Place.find({_id:{$in : places_id}},null,{lean: true}).then((results) => {
                if(results.length >0){
                    callback(null, results)
                }else{
                    callback({msg: "Aucun lieu trouvé", type_error: "no-found"})
                }
                })
        }else{
            callback({ msg: "ObjectId non conforme.", type_error: 'no-valid' });
        }
    }

    static findManyPlaces = async function (page, limit, q, options, callback){
        
        page = !page ? 1 : page
        limit = !limit ? 7 : limit
        page = !Number.isNaN(page) ? Number(page): page
        limit = !Number.isNaN(limit) ? Number(limit): limit
        
        const queryMongo = q.search ? 
            {$or : _.map(["name","categorie","city","typeOfPlace","county"], (e) => {return{[e]:{$regex:`${q.search}`,$options: 'i'}}})}
            : {}
        
        if(q.notation){
            queryMongo.notation = q.notation
        }

        if(q.hotelCategorie){

            queryMongo["moreInfo.hotelCategorie"] = {$gte: q.hotelCategorie}
        }

        if(q.user_id){
            queryMongo["owner"] = q.user_id
        }

        if(q.categorie){
            queryMongo.categorie = q.categorie
        }

        if (Number.isNaN(page) || Number.isNaN(limit)){
            callback ({msg: `format de ${Number.isNaN(page) ? "page" : "limit"} est incorrect`, type_error:"no-valid"})
        }else{
            Place.countDocuments(queryMongo).then((value) => {
                if (value > 0){
                    const skip = ((page-1) * limit)
                    Place.find(queryMongo, null, {skip:skip, limit:limit, populate: [{path:'images',perDocumentLimit:1},{
                        path:'comments',
                        perDocumentLimit:1,
                        options:{
                            sort: {
                                like : -1
                            }
                        },
                        populate:{
                            path: "user_id",
                            select: "-password -token -email -firstName -lastName -userType -about -create_at -update_at",
                            populate:{
                                path:"profilePhoto"
                            }
                        }
                    }],lean:true}).then((results) => {
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

    static findThreePlacesPerCategoryWithBestNotation = async function (callback){
        const categories = ["activity","restaurant","hotel"]
        let placesToSend = []
        try{
            for (let y =0; y<categories.length;y++){
                const queryMongo = {categorie:categories[y]}
                    const results = await Place.find(queryMongo, null, {populate: [{
                        path:'images',perDocumentLimit:1
                    },{
                        path:'comments',
                        perDocumentLimit:1,
                        options:{
                            sort: {
                                like : -1
                            }
                        },
                        populate:{
                            path: "user_id",
                            select: "-password -token -email -firstName -lastName -userType -about -create_at -update_at",
                            populate:{
                                path:"profilePhoto"
                            }
                        }
                    }],lean:true, sort: {notation:-1, numberOfNote:-1}, limit : 3})
                    placesToSend = [...placesToSend, ...results]
            }
            callback(null, placesToSend)
        }catch(e){
            callback(e)
        }
    }

    static findPlacesNear = async function(latCoordinate, lonCoordinate, callback){
        const categories = ["activity","restaurant","hotel"]
        let placesToSend = []
        if(isNaN(Number(latCoordinate))|| isNaN(Number(lonCoordinate === null))||!latCoordinate||!lonCoordinate){
            callback({
                msg:"Coordinates of the place not good",
                type_error:"no-valid"
            })
        }else{
            try{
                for (let y =0; y<categories.length;y++){
                    
                    const queryMongo = {
                        categorie:categories[y],
                        $expr: {
                            $lte: [
                                {
                                    $multiply: [
                                        6372.795477598,
                                        {
                                            $acos: {
                                                $add: [
                                                    {
                                                        $multiply: [
                                                            { $sin: { $divide: [{ $multiply: [latCoordinate, Math.PI] }, 180] } },
                                                            { $sin: { $divide: [{ $multiply: ["$latCoordinate", Math.PI] }, 180] } }
                                                        ]
                                                    },
                                                    {
                                                        $multiply: [
                                                            { $cos: { $divide: [{ $multiply: [latCoordinate, Math.PI] }, 180] } },
                                                            { $cos: { $divide: [{ $multiply: ["$latCoordinate", Math.PI] }, 180] } },
                                                            { $cos: { $subtract: [
                                                                { $divide: [{ $multiply: [lonCoordinate, Math.PI] }, 180] },
                                                                { $divide: [{ $multiply: ["$lonCoordinate", Math.PI] }, 180] }
                                                            ]}}
                                                        ]
                                                    }
                                                ]
                                            }
                                        }
                                ]
                                },
                                10
                            ]
                        }
                    }    
                    const results = await Place.find(queryMongo, null, {populate: {path:'images',perDocumentLimit:1},lean:true,limit:10})
                    placesToSend = [...placesToSend, ...results]
                }
                callback(null, placesToSend)
            }catch(e){
                callback({
                    msg: "erreur interne au serveur",
                    type_error:"error-mongo"
                })
            }
        
        }
    }

    static updateOnePlace = async function(place_id, update, options, callback){

        if(update && !update.FromCommentService && update.numberOfNote){
            delete update.numberOfNote
        }
        if(update && !update.FromCommentService && update.notation){
            delete update.notation
        }
        if(place_id && mongoose.isValidObjectId(place_id) && update){
            update.categorie = String(update.categorie)
            update.update_at = new Date()
            Place.findByIdAndUpdate(place_id, update, {returnDocument: 'after', runValidators: true, populate:["images"], lean:true}).then((value)=>{
                try{
                    if(value){
                        callback(null, value)
                    }else{
                        callback({msg: "Place non trouvée", fields_with_error: [], fields:"", type_error:"no-found"})
                    }
                }catch(e){
                    callback({msg: "Erreur avec la base de données", fields_with_error: [], fields:"", type_error:"error-mongo"})
                }
            }).catch((errors) =>{
                if (errors.code === 11000) { // Erreur de duplicité
                    const err = ErrorGenerator.generateErrorOfDuplicate(errors)
                    callback(err);
                }else{
                    const err = ErrorGenerator.generateErrorSchemaValidator(errors)
                    callback(err)
                }
            })
        }else{
            !update ? callback({msg: "propriété udpate inexistante", fields_with_error: [], fields:"", type_error: "no-valid"}) : callback({msg: "Id non conforme", type_error: "no-valid"})
        }
    }

    static async deleteOnePlace(place_id, options, callback){
        if (place_id && mongoose.isValidObjectId(place_id)){
            place_id = new mongoose.Types.ObjectId(place_id)
            const images = await Place.aggregate([{
                $match: {_id: new mongoose.Types.ObjectId(place_id)} 
                },
                {
                    $lookup: {
                        from: "images",
                        localField: "_id",
                        foreignField: "place",
                        as: 'images'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        images: 1
                    }
                }
            ]);
        
            const images_id = (images.length>0 && images[0].images.length>0)? _.map(images[0].images,"_id") : []

            if(images_id.length>0){
                await ImageService.deleteManyImages(images_id, function(err, value){
                    if (err){
                        return callback({msg:"la suppression des images a rencontré un problème",type_error:"aborded", err})
                    }
                })
            } 
            
            DependencyService.deleteAttachedDocumentsOfPlaces([place_id], function(err){      
                if(err){
                    return callback({msg:err, type_error:"aborded"})
                }else{
                    Place.findByIdAndDelete(place_id).then((value) => {
                        try{
                            if(value){
                                callback(null, value.toObject())
                            }else{
                                callback({ msg: "Place non trouvée", type_error: "no-found" })
                            }
                        }catch(e){
                            callback(e)
                        }
                    }).catch((e) => {
                        callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
                    })
                }
            })
            }else{
                callback({msg:"ID incorrecte", type_error:"no-valid"})
            }
    }

    static async deleteManyPlaces(places_id, options, callback){
        if (places_id && Array.isArray(places_id) && places_id.length>0  && places_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == places_id.length){
            places_id = places_id.map((place) => { return new mongoose.Types.ObjectId(place) })
            let images_id = []

            for(let i=0; i<places_id.length; i++){
                const images = await Place.aggregate([{
                    $match: {_id: new mongoose.Types.ObjectId(places_id[i])} 
                    },
                    {
                        $lookup: {
                            from: "images",
                            localField: "_id",
                            foreignField: "place",
                            as: 'images'
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            images: 1
                        }
                    }
                ])

                const imagesIdForOnePlace = images.length>0 && images[0].images.length>0 ? _.map(images[0].images,"_id") : []
                images_id = [...images_id, ...imagesIdForOnePlace]
            }

            if(images_id.length>0){
                await ImageService.deleteManyImages(images_id, function(err, value){
                    if (err){
                        return callback({msg:"la suppression des images a rencontré un problème",type_error:"aborded", err})
                    }
                })
            }
            DependencyService.deleteAttachedDocumentsOfPlaces(places_id, function(err){

                Place.deleteMany({_id: places_id}).then((value) => {
                    if(err){
                        return callback({msg:err, type_error:"aborded"})
                    }else{
                        if (value && value.deletedCount !== 0){
                            callback(null, value)
                        }else{
                            callback({msg: "Aucun lieu trouvé", type_error: "no-found"})
                        }
                    }
                }).catch((err) => {
                    callback({msg:"Erreur avec la base de donnée", type_error: "error-mongo"})
                })
            })
        }
        else if (places_id && Array.isArray(places_id) && places_id.length > 0 && places_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != places_id.length) {
            callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: places_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
        }
        else if (places_id && !Array.isArray(places_id)) {
            callback({ msg: "L'argument n'est pas un tableau.", type_error: 'no-valid' });

        }
        else {
            callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
        }
    }
}