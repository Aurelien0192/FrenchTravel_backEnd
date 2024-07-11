const ApiLocationService = require('./../services/ApiLocationService').ApiLocationServices

module.exports.ApiLocationControllers = class ApiLocationControllers{
    static getDataGeocode(req, res){
        req.log.info("Get coordinate from geocode")
        const params = req.query && {
            street: req.query.street,
            city: req.query.city,
            country: "France",
            postalCode : req.query.postalCode
        }
        ApiLocationService.getDataGeocode(params, function(err, value){
            if(err && err.type_error === "no-valid"){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "no-found"){
                res.statusCode = 404
                res.send(err)
            }else if(err && err.type_error === "error-api"){
                res.statusCode = 500
                res.send(err)
            }else{
                res.statusCode = 200
                res.send(value)
            }
        })
    }
}