const PlaceSchema = require ("../schemas/Place").PlaceSchema
const ApiLocationService = require("../services/ApiLocationService").ApiLocationServices
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
                    errors = errors['errors']
                    const text = Object.keys(errors).map((e) => {
                        return !errors[e].stringValue? errors[e]['properties']['message'] : `type ${errors[e]['valueType']} is not allowed in path ${errors[e]['path']}`
                    }).join (' ')

                    const fields = _.transform(Object.keys(errors), function (result, value) {
                        errors[value].properties ? result[value] = errors[value]['properties']['message'] : result[value] = ""
                    },{})
                    let fields_with_error = Object.keys(errors)
                    if(fields_with_error.includes("moreInfo.price")){
                        fields_with_error[_.findIndex(fields_with_error,(e)=>{return e ==="moreInfo.price"})] = ["price1","price2"]
                        fields_with_error= _.flatten(fields_with_error)
                    }
                    
                    const err = {
                        msg: text,
                        fields_with_error: fields_with_error,
                        fields: fields,
                        type_error : "validator"
                    }
                    callback(err)
                }else{
                    console.log(new_place)
                    if(new_place.categorie=== "restaurant" && new_place.moreInfo.price && new_place.moreInfo.price[1] < new_place.moreInfo.price[0]){
                        callback({
                            msg: "le deuxième prix ne peut être inférieur au premier prix",
                            fields_with_error: ["price1","price2"],
                            fieds : "",
                            type_error : "no-valid"
                        })
                    }else{
                        console.log("ok")
                        new_place.notation = 0
                        await new_place.save()
                        callback(null, new_place.toObject())
                    }
                
                }
            }
        }catch(error){
            if(error.code = 11000){
                const field= Object.keys(error.keyValue)[0]
                const err = {
                    msg: `Duplicate key error: ${field} must be unique.`,
                    fields_with_error: [field],
                    fields: { [field]: `The ${field} is already taken.` },
                    type_error: "duplicate"
                }
                callback(err)
            }
            callback(error)
        }
    }

    static findOnePlaceById = function (place_id, options, callback){
        const opts = {populate : options && options.populate ? ['images']:[], lean:true}
        if(place_id && mongoose.isValidObjectId(place_id)){
            Place.findById(place_id, null, opts).then((value) => {
                try{
                    if (value){
                        callback(null, value)
                    }else{
                        callback({msg: "Aucun article trouvé", type_error: "no-found"})
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

    static findManyPlaceRandom = async function (callback){
        const categories = ["activity","restaurant","hotel"]
        let placesToSend = []
        try{
            for (let y =0; y<categories.length;y++){
                const queryMongo = {categorie:categories[y]}
                const indexChoice =[]
                const nbOfPlace = await Place.countDocuments(queryMongo)
                if (nbOfPlace===0){
                    console.log(queryMongo)
                    return callback({
                        msg: "Un problème c'est produit avec la base de données",
                        type_error: "error-mongo"
                    })
                }else{
                    for (let i = 0; i< (nbOfPlace<3? nbOfPlace : 3); i++){
                        const indexRandom = _.random(0, nbOfPlace-1, false)
                        if(_.indexOf(indexChoice,indexRandom) === -1){
                            indexChoice.push(indexRandom)
                        }else{
                            i--
                        }
                    }
                
                    const results = await Place.find(queryMongo, null, {populate: {path:'images',perDocumentLimit:1},lean:true})
                    const placesToSendInt = indexChoice.map((e) => {
                        return results[e]
                    })
                    
                    placesToSend = [...placesToSend, ...placesToSendInt]
                }
                    
            }
            callback(null, placesToSend)
        }catch(e){
            console.log(e)
            callback(e)
        }
    }

    static findPlacesNear = async function(latCoordinate, lonCoordinate, callback){
        const categories = ["activity","restaurant","hotel"]
        let placesToSend = []
        if(Number(latCoordinate) === null || Number(lonCoordinate === null)){
            return ({
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
                                                            { $sin: { $divide: [{ $multiply: [Number(latCoordinate), Math.PI] }, 180] } },
                                                            { $sin: { $divide: [{ $multiply: [Number("$latCoordinateB"), Math.PI] }, 180] } }
                                                        ]
                                                    },
                                                    {
                                                        $multiply: [
                                                            { $cos: { $divide: [{ $multiply: [Number(latCoordinate), Math.PI] }, 180] } },
                                                            { $cos: { $divide: [{ $multiply: [Number("$latCoordinateB"), Math.PI] }, 180] } },
                                                            { $cos: { $subtract: [
                                                                { $divide: [{ $multiply: [Number(lonCoordinate), Math.PI] }, 180] },
                                                                { $divide: [{ $multiply: [Number("$lonCoordinateB"), Math.PI] }, 180] }
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
                }
                    const results = await Place.find(queryMongo, null, {populate: {path:'images',perDocumentLimit:1},lean:true,limit:10})
            
                    placesToSend = [...placesToSend, ...results]

                callback(null, placesToSend)
            }catch(e){
                console.log(e)
                callback({
                    msg: "erreur interne au serveur",
                    type_error:"error-mongo"
                })
            }
        
        }
    }
}