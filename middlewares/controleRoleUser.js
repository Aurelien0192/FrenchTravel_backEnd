const UserService = require('../services/UserService').UserService

module.exports.ControleRoleUser = async (req, res, next) => {
     await UserService.findOneUserById(req._id,null, function(err,value){
        req.log.info("Vérification type user avant post")
        if(err && err.type_error === "no-found"){
            res.statusCode = 404
            res.send(err)
        }else if(err && err.type_error === "no-valid"){
            res.statusCode = 405
            res.send(err)
        }else if(err && err.type_error === "erreur-mongo"){
            res.statusCode = 500
            res.send(err)
        }else{
            if(value.userType === "professional"){
                next()
            }else{
                res.statusCode =401
                res.send({
                    msg:"Cette action n'est pas autorisé en tant qu'utilisateur",
                    fields_with_error:[""],
                    fields:"",
                    type_error: "unauthorized"
                })
            }
        }
    })

    next()
}