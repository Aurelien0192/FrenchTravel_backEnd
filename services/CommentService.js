const mongoose = require('mongoose')
const CommentSchema = require('../schemas/Comment').CommentSchema
const PlaceService = require('./PlaceService').PlaceService
const _ = require('lodash')
const LikeCommentSchema = require('../schemas/LikeComment').LikeCommentSchemas

const LikeComment = mongoose.model('LikeComment',LikeCommentSchema)

CommentSchema.set('toJSON',{virtuals:true})
CommentSchema.set('toObject',{virtuals:true})

const Comment = mongoose.model('Comment',CommentSchema)

module.exports.CommentServices = class CommentService{

    static async addOneComment(user_id, place_id, comment, options, callback){
        try{
            if(user_id && mongoose.isValidObjectId(user_id) && place_id && mongoose.isValidObjectId(place_id) && comment){
                const newComment = new Comment(comment)
                newComment.place_id = new mongoose.Types.ObjectId(place_id)
                newComment.user_id = new mongoose.Types.ObjectId(user_id)
                const categorie = comment.categorie
                const numberOfNote = comment.numberOfNote
                const notation = comment.notation
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
                    try{
                        PlaceService.updateOnePlace(place_id,{
                            categorie: categorie,
                            notation: (notation * numberOfNote + newComment.note)/(numberOfNote+1),
                            numberOfNote: numberOfNote + 1
                        },null, function(err,value){
                            if(err){
                                callback({msg:"une erreur c'est produite lors de la mise à jour de la note du lieu", type_error:"interne"}, newComment.toObject())
                            }
                        })
                    }catch (e){
                        callback(e)
                    }
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

    static async addOneResponseComment(comment_id, place_id, user_id, comment, options, callback){
        try{
            if(user_id && mongoose.isValidObjectId(user_id) && comment_id && mongoose.isValidObjectId(comment_id) && place_id && mongoose.isValidObjectId(place_id) && comment){
                const newComment = new Comment(comment)
                newComment.place_id = new mongoose.Types.ObjectId(place_id)
                newComment.user_id = new mongoose.Types.ObjectId(user_id)
                const categorie = comment.categorie
                const numberOfNote = comment.numberOfNote
                const notation = comment.notation
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

                    const err = {
                        msg: text,
                        fields_with_error: fields_with_error,
                        fields: fields,
                        type_error : "validator"
                    }
                    callback(err)
                }else{
                    newComment.notation = 0
                    const newResponse = await newComment.save()
                    try{
                        CommentService.updateOneComment(comment_id,{response:newResponse._id},null, function(err,value){
                            if(err){
                                callback({msg:"une erreur c'est produite lors de la liaison de votre réponse avec le commentaire de l'utilisateur", type_error:"error-mongo"}, newComment.toObject())
                            }
                        })
                    }catch (e){
                        callback(e)
                    }
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

    static async findManyComments(page, limit, filter, options, user_id, callback){
        const populate = [{path:"likes",match:{user_id: user_id}}]

        if(options && options.populate && options.populate.includes("user_id")){ 
            populate.push({
            path: "user_id",
            populate:{
                path:"profilePhoto"
            }
        })}

        if(options && options.populate && options.populate.includes("place_id")){
            populate.push("place_id")
        }
                            
        page = !page ? 1 : page
        limit = !limit ? 0 : limit
        page = !Number.isNaN(page) ? Number(page): page
        limit = !Number.isNaN(limit) ? Number(limit): limit
        if(filter){

            const fieldsToSearch = Object.keys(filter)
            if(fieldsToSearch.includes('user_id')){
                if(mongoose.isValidObjectId(filter.user_id)){
                    filter.user_id = new mongoose.Types.ObjectId(filter.user_id)
                }else{
                    return callback({msg:"user_id is not a valid id",type_error:"no-valid"})
                }
            }
            
            if (Number.isNaN(page) || Number.isNaN(limit)){
                
                callback ({msg: `format de ${Number.isNaN(page) ? "page" : "limit"} est incorrect`, type_error:"no-valid"})
            }else{
                Comment.countDocuments(filter).then((value) => {
                    if (value > 0){
                        const skip = ((page-1) * limit)
                        try{
                            Comment.find(filter, null, {skip:skip, limit:limit, populate:populate, lean:true}).then((results) => {
                                const finalResults = results.map((result)=>{return {...result, liked: result.likes.length > 0}})
                                callback(null, {
                                    count : value,
                                    results : finalResults
                                })
                            })
                        }catch(e){
                            console.log(e)
                        }
                    }else{
                        callback(null,{count : 0, results : []})
                    }
                }).catch((e) => {
                    callback(e)
                })
            }
        }else{
            callback({msg: "query is missing", type_error:"no-valid"})
        }
    
    }

    static async updateOneComment(comment_id, update, options, callback){
        if(comment_id && mongoose.isValidObjectId(comment_id) && update){
  
            Comment.findByIdAndUpdate(new mongoose.Types.ObjectId(comment_id), update, {returnDocument: 'after', runValidators: true}).then((value)=>{
                try{
                    if(value){
                        callback(null, value.toObject())
                    }else{
                        return callback({msg: "Commentaire non trouvé", fields_with_error: [], fields:"", type_error:"no-found"})
                    }
                }catch(e){
                    callback({msg: "Erreur avec la base de données", fields_with_error: [], fields:"", type_error:"error-mongo"})
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
                    let err = {}
                    if(errors['errors']){
                        errors = errors['errors']
                        let text = Object.keys(errors).map((e) => {
                            return errors[e]['properties']['message']
                        }).join(' ')
                        let fields = _.transform(Object.keys(errors), function (result, value) {
                            result[value] = errors[value]['properties']['message'];
                        }, {});
                        err = {
                            msg: text,
                            fields_with_error: Object.keys(errors),
                            fields: fields,
                            type_error: "validator"
                        }
                    }else{
                        err ={
                            msg: `${errors.kind} not allowed in ${errors.path}`,
                            fields_with_error: [errors.path],
                            fields:"",
                            type_error:"validator"
                        }
                    }
                    callback(err)
                }
            })
        }else{
            !update ? callback({msg: "propriété udpate inexistante", fields_with_error: [], fields:"", type_error: "no-valid"}) : callback({msg: "Id non conforme", type_error: "no-valid"})
        }
    }

    static async deleteOneCommentById(comment_id, callback){
        if(comment_id && mongoose.isValidObjectId(comment_id)){
            comment_id = new mongoose.Types.ObjectId(comment_id)
            Comment.findByIdAndDelete(comment_id).then((value) => {
                if(value){
                    callback(null, value.toObject())
                }else{
                    callback({msg:"Le commentaire à supprimé n'a pas été trouvé", type_error: "no-found"})
                }
            }).catch((err) => {
                callback({msg:"une erreur interne est survenu",type_error:"error-mongo"})
            })
        }else{
            if(!comment_id){
                callback({msg:"L'ID est manquant", type_error:"no-valid"})
            }else{
                callback({msg:"l'id renseigné est invalide", type_error:"no-valid"})
            }
        }
    }

    static async deleteManyComments(comments_id, callback){
        if (comments_id && Array.isArray(comments_id) && comments_id.length>0  && comments_id.filter((e) => { return mongoose.isValidObjectId(e) }).length == comments_id.length){
            comments_id = comments_id.map((comment) => {return new mongoose.Types.ObjectId(comment)})
            Comment.deleteMany({_id: comments_id}).then((value) => {
                callback(null, value)
            }).catch((err) => {
                callback({msg:"Erreur avec la base de donnée", type_error: "error-mongo"})
            })
        }
        else if (comments_id && Array.isArray(comments_id) && comments_id.length > 0 && comments_id.filter((e) => { return mongoose.isValidObjectId(e) }).length != comments_id.length) {
            callback({ msg: "Tableau non conforme plusieurs éléments ne sont pas des ObjectId.", type_error: 'no-valid', fields: comments_id.filter((e) => { return !mongoose.isValidObjectId(e) }) });
        }
        else if (comments_id && !Array.isArray(comments_id)) {
            callback({ msg: "L'argement n'est pas un tableau.", type_error: 'no-valid' });

        }
        else {
            
            callback({ msg: "Tableau non conforme.", type_error: 'no-valid' });
        }
    }
}