const mongoose = require('mongoose')
const UserSchema = require('../schemas/User')
const _ = require('lodash')

const ObjectId = mongoose.Types.ObjectId

const User = mongoose.Schema(UserSchema)

User.createIndexes()

module.exports.UserService = class UserService{
    async addOneUser(user, options, callback){
        try{
            const newUser = new User(user)
            let errors = newUser.validateSunc()

            if(errors){
                errors = errors['errors']
                const text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                const fields = _.transform(Object.keys(errors),function (result, value){
                    result[value] = errors[value]['properties']['message']
                }, {})

                const err= {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            }else{
                await newUser.save()
                callback(null, newUser.toObject())
            }
        } catch (error) {
            if (error.code === 11000) { 
                var field = Object.keys(error.keyValue)[0];
                var err = {
                    msg: `Duplicate key error: ${field} must be unique.`,
                    fields_with_error: [field],
                    fields: { [field]: `The ${field} is already taken.` },
                    type_error: "duplicate"
                };
                callback(err);
            } else {
                callback(error);
            }
        }
    }

    async findOneUserById(user_id, option, callback) {
        if(user_id && mongoose.isValidObjectId(user_id)){
            User.findById(user_id, null, opts).then((value) => {
                try{
                    if (value){
                        callback(null, value)
                    }else{
                        callback({msg:"Aucun utilisateur trouvé", type_error: "no-found"})
                    }
                }catch(e){
                    callback({msg: "Erreur avec la base de donnée", type_error:"error-mongo"})
                }
            }).catch((err) => {
                callback(err)
            })
        }else{
            callback({msg: "Id non conforme", type_error: "no-valid"})
        }
    }

    async updateOneUser(user_id, update, options, callback){
        if(user_id && mongoose.isValidObjectId(user_id)){

            User.findByIdAndUpdate(new ObjectId(user_id), update, {returnDocument: 'after', runValidators: true}).then((value)=>{
                try{
                    if(value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg: "Utilisateur non trouvé", type_error:"no-found"})
                    }
                }catch(e){
                    callback({msg: "Erreur avec la base de donnée", type_error:"error-mongo"})
                }
            }).catch((errors) =>{
                if (errors.code === 11000) { // Erreur de duplicité
                var field = Object.keys(errors.keyPattern)[0];
                var err = {
                    msg: `Duplicate key error: ${field} must be unique.`,
                    fields_with_error: [field],
                    fields: { [field]: `The ${field} is already taken.` },
                    type_error: "duplicate"
                };
                callback(err);
            }else{
                errors = errors['errors']
                var text = Object.keys(errors).map((e) => {
                    return errors[e]['properties']['message']
                }).join(' ')
                var fields = _.transform(Object.keys(errors), function (result, value) {
                    result[value] = errors[value]['properties']['message'];
                }, {});
                var err = {
                    msg: text,
                    fields_with_error: Object.keys(errors),
                    fields: fields,
                    type_error: "validator"
                }
                callback(err)
            }
            })
        }
    }

    async deleteOneUser(user_id, options,callback) {
    if (user_id && mongoose.isValidObjectId(user_id)) {
        
        User.findByIdAndDelete(user_id).then((value) => {
            try {
                if (value)
                    callback(null, value.toObject())
                else
                callback({ msg: "Utilisateur non trouvé.", type_error: "no-found" });
            }
            catch (e) {  
                callback(e)
            }
        }).catch((e) => {
            callback({ msg: "Impossible de chercher l'élément.", type_error: "error-mongo" });
        })
    }
    else {
        callback({ msg: "Id invalide.", type_error: 'no-valid' })
    }
}
}

