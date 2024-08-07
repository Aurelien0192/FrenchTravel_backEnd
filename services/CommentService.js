const mongoose = require('mongoose')
const CommentSchema = require('../schemas/Comment').CommentSchema
const _ = require('lodash')

const Comment = mongoose.model('Comment',CommentSchema)


module.exports.CommentServices = class CommentService{
    
    static async addOneComment(user_id, place_id, comment, options, callback){
        try{
            if(user_id && mongoose.isValidObjectId(user_id) && place_id && mongoose.isValidObjectId(place_id) && comment){
                const newComment = new Comment(comment)
                newComment.place_id = place_id
                newComment.user_id = user_id

                let errors = newComment.validateSync()
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
                    newComment.notation = 0
                    await newComment.save()
                    callback(null, newComment.toObject())
                }
                
            }else{
                if(!user_id){
                    callback({msg:"user_id is missing",type_error:"no-valid"})
                }else if(!mongoose.isValidObjectId(user_id)){
                    callback({msg:"user_id is uncorrect",type_error:"no-valid"})
                }else if(!place_id){
                    callback({msg:"place_id is missing",type_error:"no-valid"})
                }else if(!mongoose.isValidObjectId(place_id)){
                    callback({msg:"place_id is uncorrect",type_error:"no-valid"})
                }else{
                    callback({
                        msg:"comment is missing",
                        fields_with_error: ["comment"],
                        fields: "",
                        type_error:"no-valid"
                    })
                }
            }
        }catch(e){
            callback(e)
        }
    }

    static async findOneCommentById(comment_id, option, callback){
        if(comment_id && mongoose.isValidObjectId(comment_id)){
            Comment.findById(comment_id).then((value) => {
                try{
                    if (value){
                        callback(null, value.toObject())
                    }else{
                        callback({msg: "Aucun commentaire trouvé", type_error: "no-found"})
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

    static findManyCommentsByUserId = async function (q, options, callback){
        if(q && mongoose.isValidObjectId(q)){
            const user_id = new mongoose.Types.ObjectId(q)
                Image.countDocuments({user_id:user_id}).then((value) => {
                    if (value > 0){
                        Image.find({user_id:user_id}).then((results) => {
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
        }
}