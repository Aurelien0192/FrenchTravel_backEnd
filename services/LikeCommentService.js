const mongoose = require('mongoose')
const LikeComment = require('../schemas/LikeCommment').LikeComment
const CommentService = require('./CommentService').CommentServices
const _ = require('lodash')

module.exports.LikeCommentServices = class LikeCommentService{
    static async addOneLikeOnComment(comment_id, user_id, nbOfLike, options, callback){
        if(comment_id && mongoose.isValidObjectId(comment_id) && user_id && mongoose.isValidObjectId(user_id)){
            const newLike = LikeComment({
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
                    callback({msg:"erreur lié à la base de donéee", type_error:"error-mongo"})
                }
            }
        }
    }

}