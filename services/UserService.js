const mongoose = require('mongoose')
const UserSchema = require('../schemas/User').UserSchema
const ImageService = require("../services/ImageService").ImageService
const ErrorGenerator = require("../utils/errorGenerator").errorGenerator
const _ = require('lodash')
const bcrypt = require("bcryptjs")
const TokenUtils = require('./../utils/token')

const SALT_WORK_FACTOR = 10

const ObjectId = mongoose.Types.ObjectId

const User = mongoose.model('User',UserSchema)

User.createIndexes()

module.exports.UserService = class UserService{
    static loginUser = async function(username, password, options, callback){
        UserService.findOneUser(['username','email'], username, null, async (err, value) => {
        if(err){
            callback(err)
        }else{
            if(bcrypt.compareSync(password, value.password)){ //comparaison hash password et password fourni lors de la co
                let token = TokenUtils.createToken({_id : value._id}, null) //création du token via jsonwebtoken en fournissant l'id utilisateur
                callback(null, {...value, token:token}) //return l'utilisateur avec le token
            }else{
                callback({msg: "La comparaison des mots de passe sont fausse",type_error:"no-comparaison"})
            }
        }
    })
}

    static async addOneUser(user, options, callback){
        try{
            const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
            if (user && user.password){
                user.password = await bcrypt.hash(user.password, salt)
            }
            const newUser = new User(user)
            let errors = newUser.validateSync()
            if(errors){
                const err = ErrorGenerator.generateErrorSchemaValidator(errors)
                callback(err)
            }else{
                await newUser.save()
                callback(null, newUser.toObject())
            }
        } catch (error) {
            if (error.code === 11000) { 
                const err = ErrorGenerator.generateErrorOfDuplicate(error)
                callback(err);
            } else {
                callback({msg: "Erreur avec la base de donnée", fields_with_error: [], fields:"", type_error:"error-mongo"})
            }
        }
    }

    static async findOneUserById(user_id, options, callback) {
        if(user_id && mongoose.isValidObjectId(user_id)){
            User.findById(user_id, null, {populate:["profilePhoto"], lean:true}).then((value) => {
                try{
                    if (value){
                        callback(null, value)
                    }else{
                        callback({msg:"Aucun utilisateur trouvé", fields_with_error: [], fields:"", type_error: "no-found"})
                    }
                }catch(e){
                    callback({msg: "Erreur avec la base de donnée", fields_with_error: [], fields:"", type_error:"error-mongo"})
                }
            }).catch((err) => {
                callback(err)
            })
        }else{
            callback({msg: "Id non conforme", fields_with_error: [], fields:"", type_error: "no-valid"})
        }
    }

    static async findOneUser(tab_field, value, options, callback){
        const field_unique = ["username","email"]
        
        if (tab_field && Array.isArray(tab_field) && value && _.filter(tab_field, (e) => {return field_unique.indexOf(e) === -1}).length ===0){
            let obj_find= []

            _.forEach(tab_field, (e) => {
                obj_find.push({ [e]: value})
            })

            User.findOne({ $or: obj_find},null, {populate:["profilePhoto"], lean:true}).then((value) => {
                if (value){
                    callback(null, value)
                }else{
                    callback({
                        msg:"utilisateur non trouvé",
                        type_error: "no-found"
                    })
                }
            }).catch((err) => {
                callback({msg:"Erreur interne mongo", type_error:"error-mongo"})
            })
        }else{
            let msg = ""
            if(!tab_field || !Array.isArray(tab_field)){
                msg += "Les champs de recherche sont incorrecte"
            }
            if(!value){
                msg +=msg ?" et la valeur de recherche est vide":"La valeur de recherche est vide"
            }
            if (_.filter(tab_field, (e) => {return field_unique.indexOf(e) === -1}).length>0){
                const field_not_authorized = _.filter(tab_field, (e) => {return field_unique.indexOf(e) === -1})
                msg += msg ? `Et (${field_not_authorized.join (',')}) ne sont pas des champs autorisés.`:
                `Les champs (${field_not_authorized.join(',')}) ne sont pas des champs de recherche autorisé`
                callback({msg : msg, type_error: "no-valid", field_not_authorized : field_not_authorized})
            }else{
                callback({msg: msg, type_error:"no-valid"})
            }
        }
    }

    static async updateOneUser(user_id, update, options, callback){
        if(user_id && mongoose.isValidObjectId(user_id) && update){
            if(Object.keys(update).includes("profilePhoto")){
                return callback({msg:"you can't change profile photos with this path", type_error:"no-valid"})
            }
            if((Object.keys(update).includes('firstName') && update.firstName ==="") || (Object.keys(update).includes('lastName')) && update.lastName ===""){
                const user = await User.findById(user_id)
                try{
                    if(!user){
                        return callback({msg:"Utilisateur non trouvé",  fields_with_error: [], fields:"", type_error:"no-found"})
                    }
                    if(user.userType === "professional"){
                        return callback({msg:`Un utilisateur ne peut pas avoir les champs nom ou prénom vides`,type_error:"no-valid"})
                    }
                }catch(e){
                    return callback({msg: "Erreur avec la base de données", fields_with_error: [], fields:"", type_error:"error-mongo"})
                }
            }
            update.update_at = new Date()
            User.findByIdAndUpdate(new ObjectId(user_id), update, {returnDocument: 'after', runValidators: true, populate:["profilePhoto"]}).then((value)=>{
                try{
                    if(value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg: "Utilisateur non trouvé", fields_with_error: [], fields:"", type_error:"no-found"})
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

    static async updateUserProfilePhoto(user_id, update, options, callback){
        update.update_at = new Date()
        User.findByIdAndUpdate(new ObjectId(user_id), update, {returnDocument: 'after', runValidators: true,populate:["profilePhoto"]}).then((value)=>{
            try{
                if(value){
                    callback(null, value.toObject())
                }else{
                    callback({msg: "Utilisateur non trouvé", fields_with_error: [], fields:"", type_error:"no-found"})
                }
            }catch(e){
                callback({msg: "Erreur avec la base de données", fields_with_error: [], fields:"", type_error:"error-mongo"})
            }
        }).catch((errors) =>{
            console.log(errors)
        })
    }

    static async deleteOneUser(user_id, options,callback) {
    if (user_id && mongoose.isValidObjectId(user_id)) {

            const images = await User.aggregate([{
                $match: {_id: new mongoose.Types.ObjectId(user_id)} 
                },
                {
                    $lookup: {
                        from: "images",
                        localField: "_id",
                        foreignField: "user_id",
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

            const images_id = (images.length>0 && images[0].images)? _.map(images[0].images,"_id") : []

            if(images_id.length>0){
                await ImageService.deleteManyImages(images_id, function(err, value){
                    if (err){
                        return callback({msg:"la suppression des images a rencontré un problème",type_error:"aborded", err})
                    }
                })
            }

            await User.findByIdAndDelete(user_id).then((value) => {
                try {
                    if (value){
                            callback(null, value.toObject())
                        }else{
                            callback({ msg: "Utilisateur non trouvé.", fields_with_error: [], fields:"", type_error: "no-found" });
                        }
                }
                catch (e) {  
                    callback(e)
                }
            }).catch((e) => {
                callback({ msg: "Impossible de chercher l'élément.", fields_with_error: [], fields:"", type_error: "error-mongo" });
            })
    } else {
        callback({ msg: "Id invalide.", fields_with_error: [], fields:"", type_error: 'no-valid' })
    }
}
}

