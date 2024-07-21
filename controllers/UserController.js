const passport = require('passport')

const UserService = require('../services/UserService').UserService

module.exports.UserControllers = class UserControllers{
    static loginUser = function(req, res, next){
        passport.authenticate('login', {badRequestMessage : "Les champs sont manquants"}, async function (err, user){
            if(err){
                res.statusCode = 401
                return res.send({
                    msg: "Le nom d'utilisateur ou mot de passe n'est pas correct", 
                    fields_with_error: ['userName','password'],
                    fields:"",
                    error_type:"no-valid"
                })
            }else{
                if (err) {
                    res.statusCode = 500
                    return res.send({
                        msg:"Problème d'authentification sur le serveur",
                        fields_with_error: [''],
                        fields:"",
                        error_type:"internal"
                    })
                }else{
                    return res.send(user)
                }
            }
        })(req, res, next)
    }

    static addOneUser(req, res){
        const opts = null
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
    
    static findOneUserById(req, res){
        const opts = null
        UserService.findOneUserById(req.params.id, opts, function(err, value){
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
                res.statusCode = 200
                res.send(value)
            }
        })
    }

    static updateOneUser(req, res){
        const opts = null
        UserService.updateOneUser(req.params.id, req.body, opts, function(err, value){
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
                res.statusCode = 200
                res.send(value)
            }
        })
    }

    static deleteOneUser(req, res){
        const opts = null
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
                res.statusCode = 200
                res.send(value)
            }
        })
    }
}