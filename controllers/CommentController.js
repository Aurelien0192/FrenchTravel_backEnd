const CommentServices = require('../services/CommentService').CommentServices
const responseOfServer = require('../utils/response').responseOfServer
const mongoose = require('mongoose')
const _ = require('lodash')

module.exports.CommentController = class CommentController{

    static addOneComment(req, res){
         req.log.info("Ajout d'un commentaire par un utilisateur")
        CommentServices.findManyComments(null, null, {place_id: req.query.place_id}, null, null, function(err, value){
            if(err && err.type_error === "no-valid"){
                res.statusCode = 405
                res.send(err)
            }else if(_.map(value.results,"user_id").some((result_user_id)=>req.user._id.equals(result_user_id))){
                res.statusCode = 405
                res.send({msg:"vous avez déjà commentez ce lieu", type_error:"no-valid"})
             }else{
                CommentServices.addOneComment(req.user._id, req.query.place_id, req.body, null, function(err, value){
                    responseOfServer(err, value, req, res, true)
                })
            }
        })
    }

    static addOneResponseComment(req, res){
        CommentServices.addOneResponseComment(req.params.id, req.user._id, req.body, null, function(err, value){
            responseOfServer(err, value, req, res, true)
        })
    }

    static findOneCommentById(req, res){
        CommentServices.findOneCommentById(req.params.id, null, function(err, value){
            responseOfServer(err, value, req, res, false)
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
        if(req.query.note){
            q.note = Array.isArray(req.query.note) ? req.query.note.map((e)=>{return Number(e)}) : [Number(req.query.note)]
        }
        CommentServices.findManyComments(req.query.page, req.query.limit, q, options, req.query.visitor_id, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static findManyCommentsByOwnerOfPlace(req, res){
        let search = ""
        if(req.query.search){
            search = req.query.search
        }
        CommentServices.findManyCommentsByOwnerOfPlace(req.query.page, req.query.limit, res.locals.idsOfPlaces,search, null, req.user._id, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static deleteOneCommentById(req, res){
        CommentServices.deleteOneCommentById(req.params.id, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }
}