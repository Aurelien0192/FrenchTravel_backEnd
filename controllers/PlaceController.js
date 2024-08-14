const { ApiLocationControllers } = require('./ApiLocationController')

const PlaceService = require('../services/PlaceService').PlaceService
const responseOfServer = require('../utils/response').responseOfServer

module.exports.PlaceControllers = class PlaceControllers {

    static addOnePlace(req, res){
        req.log.info("Création d'un lieu")
        if(req.user.userType ==='professional'){

            PlaceService.addOnePlace(req.body, req._id, null, function(err, value) {
                responseOfServer(err, value, req, res, true)
            })
        }else{
        res.statusCode=401
        res.send({
                msg:"Cette action n'est pas autorisé en tant qu'utilisateur",
                fields_with_error:[""],
                fields:"",
                type_error: "unauthorized"
            })
        }
    }

    static FindOnePlaceById(req, res){
        req.log.info("Trouver un lieu par l'id")
        PlaceService.findOnePlaceById(req.params.id, {populate :true }, function(err, value){
            responseOfServer(err, value, req, res, false)
        } )
    }


    static findThreePlacesPerCategoryWithBestNotation(req, res){
        req.log.info("Trouver des lieux aléatoirement")
        PlaceService.findThreePlacesPerCategoryWithBestNotation(function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static findPlacesNear(req, res){
        req.log.info("Trouver des lieux à proximité")
        PlaceService.findPlacesNear(Number(req.query.latCoordinate), Number(req.query.lonCoordinate), function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static findManyPlaces(req, res){
        req.log.info("Trouver des lieux par filtre")
        const q = {search : req.query.search}
        if(req.query.notation){
            q.notation = req.query.notation
        }
        if(req.query.user_id){
            q.user_id = req.query.user_id
        }
        if(req.query.hotelCategorie){
            q.hotelCategorie = Number(req.query.hotelCategorie)
        }

        if(req.query.categorie){
            q.categorie = req.query.categorie
        }
        PlaceService.findManyPlaces(req.query.page, req.query.limit, q, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static async updateOneplace(req, res, next){
        req.log.info("Modifier un lieu")
        PlaceService.updateOnePlace(req.params.id, req.body, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

    static async deleteOnePlace(req, res, next){
        req.log.info("Supprimer un lieu")
        PlaceService.deleteOnePlace(req.params.id, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }
    
    static async deleteManyPlaces(req, res, next){
        req.log.info("Supprimer plusieurs lieux")
        PlaceService.deleteManyPlaces(req.query.ids, null, function(err, value){
            responseOfServer(err, value, req, res, false)
        })
    }

}