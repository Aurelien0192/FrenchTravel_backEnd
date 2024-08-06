const passport = require('passport')

const UserService = require('../services/UserService').UserService
const responseOfServer = require('../utils/response').responseOfServer



module.exports.UserControllers = class UserControllers{

    static loginUser = function(req, res, next){
        req.log.info("Authentification d'un utilisation")
        passport.authenticate('login', {badRequestMessage: "Les champs sont manquants."}, async function (err, user){
            if(err){
                res.statusCode = 401
                return res.send({
                    msg: "Le nom d'utilisateur ou mot de passe n'est pas correct", 
                    fields_with_error: ['username','password'],
                    fields:"",
                    error_type:"no-valid"
                })
            }else{
                req.logIn(user, async function(err){
                    if (err) {
                        res.statusCode = 500
                        return res.send({
                            msg:"Problème d'authentification sur le serveur",
                            fields_with_error: [''],
                            fields:"",
                            error_type:"internal"
                        })
                    }else{
                        UserService.updateOneUser(user._id,{token: user.token},null, function(err, value){
                            responseOfServer(err, user, req, res, false)
                        })
                    }
                })
            }
        })(req, res, next)
    }

    static async logoutUser(req, res){
        req.log.info("Déconnexion d'un utilisation")
        UserService.updateOneUser(req.user._id, {token:""}, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }



    static addOneUser(req, res){
        const opts = null
        req.log.info("Ajout d'un utilisateur")
        UserService.addOneUser(req.body, opts, function(err, value){
            responseOfServer(err, value, req, res, true)
        })
    }


    
    static findOneUserById(req, res){
        UserService.findOneUserById(req.params.id, null, function(err, value){
            req.log.info("recherche d'un utilisateur")
            responseOfServer(err, value, req, res, false)
        })
    }



    static updateOneUser(req, res){
        const opts = null
        UserService.updateOneUser(req.params.id, req.body, null, function(err, value){
            req.log.info("Modification d'un utilisateur")
            responseOfServer(err, value, req, res, false)
        })
    }

    static updateUserProfilePhoto(req, res){
        const opts = null
        const update = {profilePhoto: res.locals.image._id}
        UserService.updateUserProfilePhoto(req.user._id, update, opts, function(err, value){
            req.log.info("Modification de la photo de profil d'un utilisateur")
            responseOfServer(err, value, req, res, false)
        })
    }



    static deleteOneUser(req, res){
        const opts = null
        UserService.deleteOneUser(req.params.id, opts, function(err, value){
            req.log.info("Suppression d'un utilisateur")
            responseOfServer(err, value, req, res, false)
        })
    }
}