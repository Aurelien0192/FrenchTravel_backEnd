const CommentServices = require('../services/CommentService').CommentServices
const LikeCommentService = require('../services/LikeCommentService').LikeCommentService
const responseOfServer = require('../utils/response').responseOfServer

module.exports.LikeCommentController = class LikeCommentController{
    static addOneLikeOnComment(req, res, next){
        CommentServices.findOneCommentById(req.query.comment_id, null, function(err, value){
            if(err && (err.type_error === "no-valid" || err.type_error === "validator" || err.type_error === "duplicate")){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else if(err && err.type_error ==='no-found'){
                res.statusCode = 404
                res.send(err)
            }else{
                req.query.nbOfLike = value.like
                LikeCommentService.addOneLikeOnComment(req.query.comment_id, req.user._id, req.query.nbOfLike, null, function(err, value){
                    responseOfServer(err, value, req, res, true)
                })
            }
        })
    }
}