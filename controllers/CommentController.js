const CommentServices = require('../services/CommentService').CommentServices
const responseOfServer = require('../utils/response').responseOfServer

module.exports.CommentController = class CommentController{

    static addOneComment(req, res){
        req.log.info("Ajout d'un commentaire par un utilisateur")
        CommentServices.findManyCommentsByUserId(req.user._id, null, function(err, value){
            if(err && err.type_error === "no-valid"){
                res.statusCode = 405
                res.send(err)
            }else if(value.count !==0){
                res.statusCode = 405
                res.send({msg:"vous avez déjà commentez ce lieu", type_error:"no-valid"})
            }else{    
                CommentServices.addOneComment(req.user._id, req.query.place_id, req.body, null, function(err, value){
                    responseOfServer(err, value, req, res, true)
                })
            }
        })
    }
}