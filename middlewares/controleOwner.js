const { PlaceService } = require('../services/PlaceService')

const UserService = require('../services/UserService').UserService
const ImageService = require('../services/ImageService').ImageService

module.exports.controleOwner = (req, res, next) => {
    UserService.findOneUserById(req.params.id,null, function(err, value){
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
            }else if (String(value._id) !== String(req.user._id)){
            res.statusCode = 401
            res.send({msg:"vous n'êtes pas autorisé à effectuer cette action", type_error:"authorization"})
        }else{
            next()
        }
    })
}

module.exports.controleOwnerOfPlace = (req, res, next) => {
    PlaceService.findOnePlaceById(req.params.id,null, function(err, value){
        req.log.info("contrôle autorisation modification d'un lieu")
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

module.exports.controleOwnerOfPlaces = (req, res, next) => {
    PlaceService.findManyPlacesById(req.query.ids,null, function(err, value){
        req.log.info("contrôle autorisation modification de plusieurs lieux")
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
            let valid = true
            value.forEach((e) => {
                if(String(e.owner) !== String(req.user._id)){
                    valid = false
                }
            })
            if(valid){
                next()
            }else{
                res.statusCode = 401
                res.send({msg:"vous n'êtes pas autorisé à modifier ce lieu", type_error:"authorization"})
            }
        }
    })
}

module.exports.controleOwnerOfImage = (req, res, next) => {
    UserService.findOneUserById(req.user._id, null, function(err, user){
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
                ImageService.findOneImageById(req.params.id, null, function(err, image){
                    if(err && (err.type_error === "no-valid")){
                        res.statusCode = 405
                    }else if(err && err.type_error === "error-mongo"){
                        res.statusCode = 500
                    }else if(err && err.type_error === "no-found"){
                        res.statusCode = 404
                        res.send(err)
                    }else{
                        if(String(req.user._id === image.user_id)){
                            next()
                        }else{
                            PlaceService.findOnePlaceById(image.place, null, function(err, place){
                                if (err && (err.type_error === "validator" || err.type_error === "no-valid")){
                                    res.statusCode = 405
                                    res.send(err)
                                }else if(err && err.type_error === "no-found"){
                                    res.statusCode = 404
                                    res.send(err)
                                }else if(err && err.type_error === "error-mongo"){
                                    res.statusCode = 500
                                    res.send(err)
                                }else if(req.user._id !== place.owner){
                                    res.statusCode = 401
                                    res.send({msg:"vous n'êtes pas autorisé à supprimer cette image", type_error:"authorization"})
                                }else{
                                    next()
                                }
                            })
                        }
                    }
                })
            next()
        }
    })
}

