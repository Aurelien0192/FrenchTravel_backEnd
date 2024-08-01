const { PlaceService } = require('../services/PlaceService')

const UserService = require('../services/UserService').UserService

module.exports.controleOwner = (req, res, next) => {
    UserService.findOneUserById(req.user._id,null, function(err, value){
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
                next()
            }
    })
}

module.exports.controleOwnerOfPlace = (req, res, next) => {
    PlaceService.findOnePlaceById(req.params.id,null, function(err, value){
        req.log.info("contrôle autorisation modification d'un lieu")
        console.log(value.owner != req.user._id)
        if(err && (err.type_error === "no-valid")){
            res.statusCode = 405
            res.send(err)
        }else if(err && err.type_error === "error-mongo"){
            res.statusCode = 500
            res.send(err)
        }else if(err && err.type_error ==='no-found'){
            res.statusCode = 404
            res.send(err)
        }else if (String(value.owner) !== String(req.user._id)){
            res.statusCode = 401
            res.send({msg:"vous n'êtes pas autorisé à modifier ce lieu", type_error:"authorization"})
        }else{
            next()
        }
    })
}