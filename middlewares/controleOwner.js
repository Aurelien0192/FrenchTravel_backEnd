const UserService = require('../services/UserService').UserService

module.exports.controleOwner = (req, res, next) => {
    console.log(req)
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