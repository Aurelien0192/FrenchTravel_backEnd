const ApiLocationService = require('./../services/ApiLocationService').ApiLocationServices

module.exports.ApiLocationControllers = class ApiLocationControllers{
    static async getDataGeocode(req, res, next){
        if(req.body.street){
            req.log.info("Get coordinate from geocode")
            const params = req.body && {
                street: req.body.street,
                city: req.body.city,
                country: "France",
                postalCode : req.body.codePostal
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
                    req.body.latCoordinate = Number(value[0].lat)
                    req.body.lonCoordinate = Number(value[0].lon)
                    req.route.path === "/getlocation" ? res.send(value): next()
                }
            })
        }else{
            next()
        }
    }
}