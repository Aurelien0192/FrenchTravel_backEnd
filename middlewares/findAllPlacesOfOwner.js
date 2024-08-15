const PlaceService = require('../services/PlaceService').PlaceService
const _ = require('lodash')

module.exports.findAllPlacesOfOwner = (req, res, next) => {
    PlaceService.findManyPlaces(1, 0, {user_id:req.user._id},null,function(err, value){
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
                if(value.count>0){
                    const idsOfPlaces = _.map(value.results,"_id")
                    res.locals.idsOfPlaces = idsOfPlaces
                    next()
                }else{
                    res.statusCode = 404
                    res.send({msg: "vous n'êtes propriétaire d'aucun lieu", type_error:"no-found"})
                }
            }
    })
}