
const PlaceService = require('../services/PlaceService').PlaceService
const UserService = require('../services/UserService').UserService
const responseOfServer = require('../utils/response').responseOfServer


module.exports.controlePlaceExist = (req, res, next) => {
    PlaceService.findOnePlaceById(req.query.place_id,null, function(err, value){
        responseOfServer(err, value, req, res, false, next)
    })
}