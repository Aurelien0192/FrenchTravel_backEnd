const PlaceService = require('../services/PlaceService').PlaceService

module.exports.PlaceControllers = class PlaceControllers {
    static addOnePlace(req, res){
        req.log.info("One place creation")
        PlaceService.addOnePlace(req.body, null, function(err, value) {
            if(err && (err.type_error === "validator" || err.type_error === "no-valid")){
                res.statusCode = 405
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })
    }
}