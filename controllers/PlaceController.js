const PlaceService = require('../services/PlaceService').PlaceService

module.exports.PlaceControllers = class PlaceControllers {
    static addOnePlace(req, res){
        req.log.info("One place creation")

        if(req.user.userType ==='professional'){

            PlaceService.addOnePlace(req.body, req._id, null, function(err, value) {
                if(err && (err.type_error === "validator" || err.type_error === "no-valid")){
                    res.statusCode = 405
                    res.send(err)
                }else{
                    res.statusCode = 201
                    res.send(value)
                }
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
        PlaceService.findOnePlaceById(req.params.id, {populate :true }, function(err, value){
            if (err && (err.type_error === "validator" || err.type_error === "no-valid")){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "no-found"){
                res.statusCode = 404
                res.send(err)
            }else if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else{
                res.statusCode = 200
                res.send(value)
            }
        } )
    }
}