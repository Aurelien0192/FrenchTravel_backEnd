const mongoose  = require("mongoose")
const _ = require("lodash")
const CommentServices = require("../services/CommentService").CommentServices
const LikeCommentService = require("../services/LikeCommentService").LikeCommentService

module.exports.dependencyService = class DependencyService{
    static deleteAttachedDocumentsOfUser(user_id, callback){
        const PlaceService = require("../services/PlaceService").PlaceService
        let error = ""
        PlaceService.findManyPlaces(null, null, {user_id:user_id},null,function(err, value){
            if(err && err.type_error !== "no-found"){
                error = error, "une erreur c'est produite lors de la recherche de vos établissements"
            }
            PlaceService.deleteManyPlaces(_.map(value.results,"_id"),null, function(err){
                if(err && err.type_error != "no-found"){
                    error = error, "une erreur c'est produite lors de la suppression de vos établissements"
                }
                DependencyService.deleteAttachedDocumentsOfPlaces(_.map(value.results,"_id"),function (err){
                    if(err){
                        error = error + err
                    }
                    CommentServices.findManyComments(null, null, {user_id:user_id},null, null, function(err, value){
                        if(err && err.type_error !== "no-found"){
                            error = error,"une erreur c'est produite lors de la recherche des commentaires que vous avez postez"
                        }
                        if(value && value.count>0){
                            const comments_id = _.map(value.results,"_id")
                            CommentServices.deleteManyComments(comments_id,function(err, value){
                                if(err && err.type_error !== "no-found"){
                                    error = error, "une erreur c'est produite lors la suppression de vos commentaires"   
                                }
                                LikeCommentService.deleteManyLikesComments(comments_id,function(err, value){
                                    if(err && err.type_error !=="no-found"){
                                        error = error, "une erreur c'est produite lors la suppression des likes liés à vos commentaires"   
                                    }
                                    callback(error)
                                })
                            })
                        }else{
                            callback()
                        }
                    })   
                })
            })
        })
    }


    static async deleteAttachedDocumentsOfPlaces(places_ids, callback){
        let error = ""
        CommentServices.findManyComments(null, null, {place_id:places_ids},null, null, function(err, value){
            if(err && err.type_error !== "no-found"){
                error = error,"une erreur c'est produite lors de la recherche des commentaires associés à votre établissement"
            }
            if(value && value.count>0){
                const comments_id = _.map(value.results,"_id")
                CommentServices.deleteManyComments(comments_id,function(err, value){
                    if(err && err.type_error !== "no-found"){
                        error = error, "une erreur c'est produite lors la suppression des commentaires associés à votre établissement"  
                    }
                    LikeCommentService.deleteManyLikesComments(comments_id,function(err, value){
                        if(err && err.type_error !=="no-found"){
                            error = error, "une erreur c'est produite lors la suppression des likes liés aux commentaires sur votre établissement"  
                        }
                        callback(error)
                    })
                })
            }else{
                callback()
            }
        })   
    }
}