const mongoose = require('mongoose')
const UserSchema = require('../schemas/User').UserSchema
const _ = require('lodash')

const ObjectId = mongoose.Types.ObjectId

const User = mongoose.model('User',UserSchema)

User.createIndexes()

module.exports.UserService = class UserService{
    static async addOneUser(user, options, callback){
        try{
            const newUser = new User(user)
            let errors = newUser.validateSync()
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
                callback({msg: "Erreur avec la base de donnée", type_error:"error-mongo"})
            }
        }
    }

    static async findOneUserById(user_id, option, callback) {
        if(user_id && mongoose.isValidObjectId(user_id)){
            User.findById(user_id).then((value) => {
                try{
                    if (value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg:"Aucun utilisateur trouvé", type_error: "no-found"})
                    }
                }catch(e){
                    console.log(e)
                    callback({msg: "Erreur avec la base de donnée", type_error:"error-mongo"})
                }
            }).catch((err) => {
                callback(err)
            })
        }else{
            callback({msg: "Id non conforme", type_error: "no-valid"})
        }
    }

    static async updateOneUser(user_id, update, options, callback){
        if(user_id && mongoose.isValidObjectId(user_id) && update){
            if((Object.keys(update).includes('firstName') && update.firstName ==="") || (Object.keys(update).includes('lastName')) && update.lastName ===""){
                const user = await User.findById(user_id)
                try{
                    if(!user){
                        return callback({msg:"Utilisateur non trouvé", type_error:"no-found"})
                    }
                    if(user.userType === "professional"){
                        return callback({msg:`Un utilisateur ne peut pas avoir les champs nom ou prénom vides`,type_error:"no-valid"})
                    }
                }catch(e){
                    return callback({msg: "Erreur avec la base de données", type_error:"error-mongo"})
                }
            }
            User.findByIdAndUpdate(new ObjectId(user_id), update, {returnDocument: 'after', runValidators: true}).then((value)=>{
                try{
                    if(value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg: "Utilisateur non trouvé", type_error:"no-found"})
                    }
                }catch(e){
                    callback({msg: "Erreur avec la base de données", type_error:"error-mongo"})
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
        }else{
            !update ? callback({msg: "propriété udpate inexistante", type_error: "no-valid"}) : callback({msg: "Id non conforme", type_error: "no-valid"})
        }
    }

    static async deleteOneUser(user_id, options,callback) {
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

