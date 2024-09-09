const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports.createToken = function(payload, options){ //création du token avec 
    return jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"2h"}) //return du token créé avec payload, chiffré grace à la clé sercret et temps d'expiration à 2h
}