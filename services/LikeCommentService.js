const mongoose = require('mongoose')
const CommentService = require('./CommentService').CommentServices
const _ = require('lodash')

const LikeCommentSchema = require('../schemas/LikeComment').LikeCommentSchemas

const LikeComment = mongoose.model('LikeComment',LikeCommentSchema)


module.exports.LikeCommentService = class LikeCommentService{
    static async addOneLikeOnComment(comment_id, user_id, nbOfLike, options, callback){
        if(comment_id && mongoose.isValidObjectId(comment_id) && user_id && mongoose.isValidObjectId(user_id)){
            const newLike = new LikeComment({
                comment_id: new mongoose.Types.ObjectId(comment_id),
                user_id: new mongoose.Types.ObjectId(user_id)
            })
            let errors = newLike.validateSync()
            if(errors){
                errors = errors['errors']
                const text = Object.keys(errors).map((e) => {
                    return !errors[e].stringValue? errors[e]['properties']['message'] : `type ${errors[e]['valueType']} is not allowed in path ${errors[e]['path']}`
                }).join (' ')
                const fields = _.transform(Object.keys(errors), function (result, value) {
                    errors[value].properties ? result[value] = errors[value]['properties']['message'] : result[value] = ""
                },{})
                let fields_with_error = Object.keys(errors)                    
                const err = {
                    msg: text,
                    fields_with_error: fields_with_error,
                    fields: fields,
                    type_error : "validator"
                }
                callback(err)
            }else{
                try{
                    CommentService.updateOneComment(comment_id,{like: nbOfLike +1},null, function(err, value){
                        if(err){
                            return callback({msg:"une erreur c'est produite lors de la mise à jour du commentaire", type_error:err.type_error})
                        }
                    })
                    await newLike.save()
                    callback(null, newLike.toObject())
                } catch(e){
                    if(e.code === 11000){
                        callback({msg:"vous avez déjà commentez ce lieu", type_error:"no-valid"})
                    }else{
                        callback({msg:"erreur lié à la base de donéee", type_error:"error-mongo"})
                    }
                }
            }
        }else{
            if(!comment_id){
                callback({msg: "comment ID is missing", type_error:"no-valid"})
            }else if(!mongoose.isValidObjectId(comment_id)){
                callback({msg: "comment ID is uncorrect", type_error:"no-valid"})
            }else if(!user_id){
                callback({msg: "user ID is missing", type_error:"no-valid"})
            }else if(!mongoose.isValidObjectId(user_id)){
                callback({msg: "user ID is uncorrect", type_error:"no-valid"})
            }
        }
    }

    static async deleteOneLikeComment(comment_id, user_id, nbOfLike ,options, callback){
        if(user_id && mongoose.isValidObjectId(user_id)){
            const userId = new mongoose.Types.ObjectId(user_id)
            await LikeComment.deleteOne({user_id:userId}, null, {lean:true}).then((value) => {
                try {
                    if (value.deletedCount>0){
                        try{
                            CommentService.updateOneComment(comment_id,{like: nbOfLike -1},null, function(err, value){
                                if(err){
                                    return callback({msg:"une erreur c'est produite lors de la mise à jour du commentaire", type_error:err.type_error})
                                }
                            })
                            callback(null, value)
                        }catch(e){
                           callback({msg:"erreur lié à la base de donéee", type_error:"error-mongo"}) 
                        }
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
        }else{
            if(!user_id){
                callback({msg: "user ID is missing", type_error:"no-valid"})
            }else{
                callback({msg: "user ID is uncorrect", type_error:"no-valid"})
            }
        }
    }

}