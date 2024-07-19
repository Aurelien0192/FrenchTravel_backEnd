const UserService = require('../services/UserService')

module.exports.UserControllers = class UserControllers{
    static addOneUser(req, res){
        req.log.info("Ajout d'un utilisateur")
        UserService.addOneUser(req.body, opts, function(err, value){
            if(err && (err.type_error === "no-valid" || err.type_error === "validator" || err.type_error === "duplicate")){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })
    }
    static findOneUser(req, res){
        UserService.findOneUser(req.params.id, opts, function(err, value){
            req.log.info("recherche d'un utilisateur")
            if(err && (err.type_error === "no-valid")){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else if(err && err.type_error ==='no-found'){
                res.statusCode = 404
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })
    }

    static updateOneUser(req, res){
        UserService.updateOneUser(req.params.id, opts, function(err, value){
            req.log.info("Modification d'un utilisateur")
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
                res.statusCode = 201
                res.send(value)
            }
        })
    }

    static deleteOneUser(req, res){
        UserService.deleteOneUser(req.params.id, opts, function(err, value){
            if(err && (err.type_error === "no-valid")){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else if(err && err.type_error ==='no-found'){
                res.statusCode = 404
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })
    }
}