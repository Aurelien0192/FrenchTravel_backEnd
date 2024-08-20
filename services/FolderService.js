const FolderSchema = require('../schemas/Folder').FolderSchema
const _ = require('lodash')
const ErrorGenerator = require('../utils/errorGenerator').errorGenerator
const mongoose = require('mongoose')

FolderSchema.set('toJSON',{virtuals:true})
FolderSchema.set('toObject',{virtuals:true})

const Folder = mongoose.model('Folder',FolderSchema)

module.exports.FolderService = class FolderService{

    static async addOneFolder(user_id, body, options, callback){
        if(user_id && mongoose.isValidObjectId(user_id)){
            if(body){
                user_id = new mongoose.Types.ObjectId(user_id)
                const new_folder = new Folder(body)
                new_folder.user = user_id
                const errors = new_folder.validateSync()
                if(errors){
                    let err = ErrorGenerator.generateErrorSchemaValidator(errors)
                    callback(err)
                }else{
                    try{
                        await new_folder.save()
                        callback(null, new_folder.toObject())
                    }catch(e){
                        callback({msg: "Erreur avec la base de donnée", fields_with_error: [], fields:"", type_error:"error-mongo"})
                    }   
                }
            }else{
                callback({msg: "aucun nom n'a été renseigné", type_error:"no-valid"})
            }
        }else{
            const err = ErrorGenerator.controlIntegrityofID({user_id})
            callback(err)
        }
    }
    static findOneFolderById(folder_id, options, callback){
        if(folder_id && mongoose.isValidObjectId(folder_id)){
            folder_id = new mongoose.Types.ObjectId(folder_id)
            Folder.findById(folder_id, null, {populate:"favorites",lean:true}).then((value)=>{
                if(value){
                    callback(null, value)
                }else{
                    callback({msg:"aucun dossier trouvé", type_error:"no-found"})
                }
            }).catch((e)=>{
                callback({msg: "Erreur avec la base de donnée", fields_with_error: [], fields:"", type_error:"error-mongo"})
            })
        }else{
            const err = ErrorGenerator.controlIntegrityofID({folder_id})
            callback(err)
        }
    }

    static findManyFolders(page, limit, user_id, options, callback){
        page = !page ? 1 : page
        limit = !limit ? 20 : limit
        page = !Number.isNaN(page) ? Number(page): page
        limit = !Number.isNaN(limit) ? Number(limit): limit

        if(user_id && mongoose.isValidObjectId(user_id)){
            user_id = new mongoose.Types.ObjectId(user_id)
            if (Number.isNaN(page) || Number.isNaN(limit)){
                callback ({msg: `format de ${Number.isNaN(page) ? "page" : "limit"} est incorrect`, type_error:"no-valid"})
            }else{
                Folder.countDocuments({user: user_id}).then((value) => {
                    if (value > 0){
                        const skip = ((page-1) * limit)
                        Folder.find({user: user_id}, null, {skip:skip, limit:limit, lean:true}).then((results) => {
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
            const err = ErrorGenerator.controlIntegrityofID({user_id})
            callback(err)
        }
    }

    static updateFolderById(folder_id, body, options, callback){
        if(folder_id && mongoose.isValidObjectId(folder_id)){
            if(body && Object.keys(body).length===1 && Object.keys(body)[0]==="name"){
                Folder.findByIdAndUpdate(folder_id, body,{returnDocument: 'after', runValidators: true}).then((value)=>{
                    if(value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg:"le dossier n'a pas été trouvé", type_error:"no-found"})
                    }
                }).catch((errors)=>{
                    const err = ErrorGenerator.generateErrorSchemaValidator(errors)
                    callback(err)
                })
            }else{
                callback({msg:"body is not valid",type_error:"no-valid"})
            }
        }else{
            const err = ErrorGenerator.controlIntegrityofID({folder_id})
            callback(err)
        }

    }

    static deleteOneFolderById(folder_id, options, callback){
        if(folder_id && mongoose.isValidObjectId(folder_id)){
            folder_id = new mongoose.Types.ObjectId(folder_id)
            Folder.findByIdAndDelete(folder_id).then((value)=>{
                if(value){
                    callback(null, value.toObject())
                }else{
                    callback({msg:"aucun dossier trouvé", type_error:"no-found"})
                }
            }).catch((e)=>{
                callback(e)
            })
        }else{
            const err = ErrorGenerator.controlIntegrityofID({folder_id})
            callback(err) 
        }
    }

    static deleteManyFolder(user_id, options, callback){
        if(user_id && mongoose.isValidObjectId(user_id)){
            user_id = new mongoose.Types.ObjectId(user_id)
            Folder.deleteMany({user:user_id}).then((value) =>{
                if (value && value.deletedCount !== 0){
                    callback(null, value)
                }else{
                    callback({msg: "Aucun dossier trouvé", type_error: "no-found"})
                }
            }).catch((e)=>{
                callback(e)
            })
        }else{
            const err = ErrorGenerator.controlIntegrityofID({user_id})
            callback(err) 
        }
    }
}