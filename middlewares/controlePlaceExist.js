const PlaceService = require('../services/PlaceService').PlaceService
const responseOfServer = require('../utils/response').responseOfServer


module.exports.controlePlaceExist = (req, res, next) => {
    PlaceService.findOnePlaceById(req.query.place_id,null, function(err, value){
        if(value){
            req.body.categorie = value.categorie
            req.body.notation = value.notation ? value.notation : 0
            req.body.numberOfNote = value.numberOfNote ? value.numberOfNote : 0
        }
        responseOfServer(err, value, req, res, false, next)
    })
}

module.exports.controlePlaceExistForFavorite = (req, res, next) => {
    PlaceService.findOnePlaceById(req.params.id, null, function(err, value){
        responseOfServer(err, value, req, res, false, next)
    })
}