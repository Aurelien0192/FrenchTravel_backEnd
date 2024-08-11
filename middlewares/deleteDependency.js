const CommentServices = require("../services/CommentService").CommentServices
const LikeCommentService = require("../services/LikeCommentService").LikeCommentService
const PlaceService = require("../services/PlaceService").PlaceService
const _ = require("lodash")

module.exports.deleteDependency = class DeleteDependency{
    static deleteAttachedCommentsOfUser(req, res){
        let error = "Votre profil a bien été supprimé mais"
        error = error, deleteAttachedDocumentsOfUser(req.params._id)
        if(error !== "Votre établissement a bien été supprimé mais"){
            res.status(500).send({err:error})
        }else{  
            res.status(200).send({msg: "la suppression de votre établissement c'est déroulée avec succès"})
        }  
    }

    static deleteAttachedDocumentsOfPlaces(req, res){
    let error = "Votre établissement a bien été supprimé mais"
        error = error, deleteAttachedDocumentsOfPlaces(req.query.ids? req.query.ids : req.params.id)
        if(error !== "Votre établissement a bien été supprimé mais"){
            res.status(500).send({err:error})
        }else{  
            res.status(200).send({msg: "la suppression de votre établissement c'est déroulée avec succès"})
        }
    }

    static deleteAttachedDocumentsOfUser(req, res){
        let error = "Votre profil a bien été supprimé mais"
        const errorsFromOtherServices = []
        PlaceService.findManyPlaces(null, null, {user_id:req.params.id},null,function(err, value){
            console.log(value)
            if(err && err.type_error !== "no-found"){
                error = error, "une erreur c'est produite lors de la recherche de vos établissements"
            }
            if(value && value.count > 0){
                const place_ids = _.map(value.results, "_id")
                PlaceService.deleteManyPlaces(place_ids, null, function(err, value){
                    if(err && err.type_error !=="no-found"){
                        error = error, " une erreur c'est produite lors de la supression de vos établissements"
                    }else{
                        const errorPlace = deleteAttachedDocumentsOfPlaces(place_ids)
                        if(errorPlace){
                            error = error, "une erreur c'est produite lors de la supression des commentaires et likes associées à votre établissement"
                            errorsFromOtherServices.push(errorPlace)
                        }
                    }
                })
                
                const errorComments = deleteAttachedDocumentsOfUser(req.user._id)
                if(errorComments){
                    error = error, " une erreur c'est produite lors de la suppression de vos commentaires"
                    errorsFromOtherServices.push(errorComments)
                }
            }
            if(error ==! "Votre profil a bien été supprimé mais"){
                res.status(500).send({msg: error, error: errorsFromOtherServices, type_error:"Interne"})
            }else{
                res.status(200).send({msg: "la suppression de votre profil c'est déroulée avec succès"})
            }
        })
    }
}

function deleteAttachedDocumentsOfPlaces(places_ids){
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
            })
            LikeCommentService.deleteManyLikesComments(comments_id,function(err, value){
                if(err && err.type_error !==no-found){
                    error = error, "une erreur c'est produite lors la suppression des likes liés aux commentaires sur votre établissement"  
                }
            })
        }
        return (error)
    })   
}

function deleteAttachedDocumentsOfUser(user_id){
    let error = ""
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
            })
            LikeCommentService.deleteManyLikesComments(comments_id,function(err, value){
                if(err && err.type_error !==no-found){
                    error = error, "une erreur c'est produite lors la suppression des likes liés à vos commentaires"   
                }
            })
        }
        return (error)
    })   
}