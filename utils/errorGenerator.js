const mongoose = require('mongoose')
const _ = require('lodash')

module.exports.errorGenerator = class ErrorGenerator{
    static generateErrorSchemaValidator(errors){
        errors = errors['errors']
        const text = Object.keys(errors).map((e) => {
            return !errors[e].stringValue? errors[e]['properties']['message'] : `type ${errors[e]['valueType']} is not allowed in path ${errors[e]['path']}`
        }).join (' ')
        const fields = _.transform(Object.keys(errors), function (result, value) {
            errors[value].properties ? result[value] = errors[value]['properties']['message'] : result[value] = ""
        },{})
        console.log(fields)
        let fields_with_error = Object.keys(errors)

        const err = {
            msg: text,
            fields_with_error: fields_with_error,
            fields: fields,
            type_error : "validator"
        }
        console.log(err)
        return err
    }

    static generateErrorOfDuplicate(errors){
        const field = Object.keys(errors.keyPattern)[0];
        const err = {
            msg: `Duplicate key error: ${field} must be unique.`,
            fields_with_error: [field],
            fields: { [field]: `The ${field} is already taken.` },
            type_error: "duplicate"
        };
        return err
    }

    static controlIntegrityofID(ids){
        let err = {
            msg: "",
            type_error: "no-valid"
        }
        const idType = Object.keys(ids)
        idType.forEach((id) =>{
            if(!ids[String(id)]){
                err.msg =`${id} is missing`
            }
            else if(!mongoose.isValidObjectId(ids[String(id)])){
                err.msg =`${id} is uncorrect`
            }
        })
        return err
    }
}