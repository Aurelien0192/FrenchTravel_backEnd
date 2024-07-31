const passport = require('passport')

const UserService = require('../services/UserService').UserService




module.exports.UserControllers = class UserControllers{

/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login user
 *      description: Login user with the provided details
 *      tags:
 *          - Login
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Login'
 *      responses:
 *          200:
 *              description: Login successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/User'
 *          401:
 *              $ref: '#/components/responses/ErrorLogin'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

    static loginUser = function(req, res, next){
        passport.authenticate('login', {badRequestMessage: "Les champs sont manquants."}, async function (err, user){
            if(err){
                res.statusCode = 401
                return res.send({
                    msg: "Le nom d'utilisateur ou mot de passe n'est pas correct", 
                    fields_with_error: ['username','password'],
                    fields:"",
                    error_type:"no-valid"
                })
            }else{
                req.logIn(user, async function(err){
                    if (err) {
                        res.statusCode = 500
                        return res.send({
                            msg:"Problème d'authentification sur le serveur",
                            fields_with_error: [''],
                            fields:"",
                            error_type:"internal"
                        })
                    }else{
                        return res.send(user)
                    }
                })
            }
        })(req, res, next)
    }

/**
 * @swagger
 * /user:
 *  post:
 *      summary: Create a new user
 *      description : Create a new user with the provided details
 *      tags:
 *          - User
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: User created successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description: Internal server error
 */

    static addOneUser(req, res){
        const opts = null
        req.log.info("Ajout d'un utilisateur")
        UserService.addOneUser(req.body, opts, function(err, value){
            if(err && (err.type_error === "no-valid" || err.type_error === "validator" || err.type_error === "duplicate")){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else{
                res.statusCode = 201
                res.send(value)
            }
        })
    }

/**
 * @swagger
 * /user/{id}:
 *  get:
 *      summary: find user by id
 *      description : Create a new user with the provided details
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the user to get
 *      tags:
 *          - User
 *      responses:
 *          201:
 *              description: User find successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/User'
 *          403: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */
    
    static findOneUserById(req, res){
        const opts = null
        UserService.findOneUserById(req.params.id, opts, function(err, value){
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
                res.statusCode = 200
                res.send(value)
            }
        })
    }

/**
 * @swagger
 * /user:
 *  put:
 *      summary: Update user
 *      description : Update a user with provided
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the user to get
 *      tags:
 *          - User
 *      requestBody:
 *          required: false
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: User updated successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/User'
 *          403: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

    static updateOneUser(req, res){
        const opts = null
        UserService.updateOneUser(req.params.id, req.body, opts, function(err, value){
            req.log.info("Modification d'un utilisateur")
            if(err && (err.type_error === "no-valid" || err.type_error === "validator" || err.type_error === "duplicate")){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else if(err && err.type_error ==='no-found'){
                res.statusCode = 404
                res.send(err)
            }else{
                res.statusCode = 200
                res.send(value)
            }
        })
    }

    static updateUserProfilePhoto(req, res){
        const opts = null
        const update = {profilePhoto: res.locals.image._id}
        UserService.updateUserProfilePhoto(req.user._id, update, opts, function(err, value){
            req.log.info("Modification de la photo de profil d'un utilisateur")
            if(err && (err.type_error === "no-valid" || err.type_error === "validator" || err.type_error === "duplicate")){
                res.statusCode = 405
                res.send(err)
            }else if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else if(err && err.type_error ==='no-found'){
                res.statusCode = 404
                res.send(err)
            }else{
                res.statusCode = 200
                res.send(value)
            }
        })
    }

    /**
 * @swagger
 * /user:
 *  delete:
 *      summary: Delete one user
 *      description : delete one user by using ID
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the user to get
 *      tags:
 *          - User
 *      responses:
 *          201:
 *              description: User deleted successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/User'
 *          403: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

    static deleteOneUser(req, res){
        const opts = null
        UserService.deleteOneUser(req.params.id, opts, function(err, value){
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
                res.statusCode = 200
                res.send(value)
            }
        })
    }
}