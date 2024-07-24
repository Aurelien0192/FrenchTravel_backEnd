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
                    new_place.notation = 0
                
                    await new_place.save()
                    callback(null, new_place.toObject())
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
        const opts = {populate : options && options.populate ? {path:'images',perDocumentLimit:1}:[], lean:true}
        if(place_id && mongoose.isValidObjectId(place_id)){
            Place.findById(place_id, null, opts).then((value) => {
                try{
                    if (value){
                        callback(null, value.toObject())
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
}