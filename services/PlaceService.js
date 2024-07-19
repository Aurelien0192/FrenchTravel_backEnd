const PlaceSchema = require ("../schemas/Place").PlaceSchema
const ApiLocationService = require("../services/ApiLocationService").ApiLocationServices
const _ = require('lodash')
const mongoose = require('mongoose');

const Place = mongoose.model('Place', PlaceSchema)

module.exports.PlaceService =  class PlaceService{

    static addOnePlace = async function (place, options, callback){
        try{
            if(!place){
                callback({msg:"body is missing", type_error:"no-valid"})

            }else{
                const new_place = new Place(place)
                let errors = new_place.validateSync()
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

                    new_place.notation = 0
                
                    await new_place.save()
                    callback(null, new_place.toObject())
                }
            }
        }catch(error){
            if(error.code = 11000){
                const field= Object.keys(error.keyValue)[0]
                const err = {
                    msg: `Duplicate key error : ${field} must be unique`,
                    fields_with_error: [field],
                    type_error:"duplicate"
                }
                callback(err)
            }
            console.log(error)
            callback(error)
        }
    }
}