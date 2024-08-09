const CommentServices = require('../services/CommentService').CommentServices
const LikeCommentService = require('../services/LikeCommentService').LikeCommentService
const responseOfServer = require('../utils/response').responseOfServer

module.exports.LikeCommentController = class LikeCommentController{
    static addOneLikeOnComment(req, res, next){
        CommentServices.findManyComments(null, null, {user_id:req.user._id}, null, null, function(err, value){
            responseOfServer(err, value, req, res, false, next)
            if(value.count !== 0){
                LikeCommentService.addOneLikeOnComment(req.query.comment_id, req.user._id, req.query.nbOfLike, null, function(err, value0){
                    responseOfServer(err, value, req, res, true)
                })
            }else{
                res.statusCode= 401
                res.send({msg:"vous ne pouvez pas liker deux fois un même commentaire",type_error:"authorization"})
            }
        })
    }
}