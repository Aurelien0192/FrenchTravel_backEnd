const CommentServices = require('../services/CommentService').CommentServices
const responseOfServer = require('../utils/response').responseOfServer

module.exports.CommentController = class CommentController{

    static addOneComment(req, res){
        req.log.info("Ajout d'un commentaire par un utilisateur")   
        CommentServices.addOneComment(req.user._id, req.query.place_id, req.body, null, function(err, value){
            responseOfServer(err, value, req, res, true)
        })
    }

    static findManyComments(req, res){
        let options={}
        req.log.info("Rechercher des commentaires")
        if (req.query.options === "populateuser_id"){
            options.populate = "user_id"
        }
        if (req.query.options === 'populateplace_id'){
            options.populate = "place_id"
        }
        let q = {}
        if(req.query.place_id){
            q.place_id = req.query.place_id
        }
        if(req.query.user_id){
            q.user_id = req.query.user_id
        }
        CommentServices.findManyComments(req.query.page, req.query.limit, q, req.query.user_id, options, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }
}