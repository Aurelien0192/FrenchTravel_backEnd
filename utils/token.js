const jwt = require("jsonwebtoken")
const ConfigFile = require("./../config").passportConfig

module.exports.createToken = function(payload, options){ //création du token avec 
    return jwt.sign(payload,ConfigFile.getSecretKey(),{expiresIn:"2h"}) //return du token créé avec payload, chiffré grace à la clé sercret et temps d'expiration à 2h
}