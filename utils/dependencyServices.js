const mongoose  = require("mongoose")
const _ = require("lodash")

module.exports.dependencyService = class DependencyService{

    static deleteAttachedDocumentsOfUser(user_id, callback){
        const CommentServices = require("../services/CommentService").CommentServices
        const PlaceService = require("../services/PlaceService").PlaceService
        const LikeCommentService = require("../services/LikeCommentService").LikeCommentService
        const FolderService = require('../services/FolderService').FolderService
        const FavoriteService = require('../services/FavoriteService').FavoriteService
        let error = ""
        PlaceService.findManyPlaces(null, null, {user_id:user_id},null,function(err, value){
            if(err && err.type_error !== "no-found"){
                error = error, "une erreur c'est produite lors de la recherche de vos établissements"
            }
            PlaceService.deleteManyPlaces(_.map(value.results,"_id"),null, function(err){
                if(err && err.type_error != "no-found"){
                    error = error, "une erreur c'est produite lors de la suppression de vos établissements"
                }
                FolderService.deleteManyFolder(user_id, null, function(err, value){
                    if(err && err.type_error !== "no-found"){
                        error = error, "une erreur c'est produite lors de la suppression de vos dossiers"
                    }
                    FavoriteService.deleteManyFavorites(user_id, null, function(err, value){
                        if(err && err.type_error !== "no-found"){
                            error = error, "une erreur c'est produite lors de la suppression de vos favoris"
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
        })
    }

    
    static async deleteAttachedDocumentsOfPlaces(places_ids, callback){
        const CommentServices = require("../services/CommentService").CommentServices
        const LikeCommentService = require("../services/LikeCommentService").LikeCommentService
        const FavoriteService = require('../services/FavoriteService').FavoriteService
        let error = ""
        FavoriteService.deleteManyFavorites(places_ids, null, function(err, value){
            if(err && err.type_error !== "no-found"){
                error = error, "une erreur c'est produite lors de la suppression de vos favoris"
            }
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
        })
    }

    static async deleteAttachedDocumentsOfComments(comment_id,callback){
        const LikeCommentService = require("../services/LikeCommentService").LikeCommentService
        let error =""
        LikeCommentService.deleteManyLikesComments([comment_id], function(err, value){
            if(err && err.type_error !== "no_found"){
                error = error, "une erreur c'est produite lors de la suppression des likes associées"
            }
            callback(error)
        })
    }

    static async deleteAttachedDocumentsOfFolder(folder_id,callback){
        const FavoriteService = require("../services/FavoriteService").FavoriteService
        let error=""
        FavoriteService.deleteManyFavorites(folder_id,null, function(err, value){
            if(err && err.type_error !== "no_found"){
                error = error, "une erreur c'est produite lors de la suppression des favoris présent dans votre/vos dossier(s)"
            }
            callback(error)
        })
    }
}