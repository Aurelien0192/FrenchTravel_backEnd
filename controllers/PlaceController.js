const PlaceService = require('../services/PlaceService').PlaceService

module.exports.PlaceControllers = class PlaceControllers {

/**
 * @swagger
 * /place:
 *  post:
 *      summary: Post Place
 *      description: Post a new place by professional user
 *      tags:
 *          - Place
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Place'
 *      responses:
 *          200:
 *              description: Create Place successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Place'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

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

/**
 * @swagger
 * /place/{id}:
 *  get:
 *      summary: Get Place by ID
 *      description: obtain place information
 *      tags:
 *          - Place
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the user to get
 *      responses:
 *          200:
 *              description: Get Place successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Place'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

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

/**
 * @swagger
 * /places/random:
 *  get:
 *      summary: Get random places
 *      description: obtain randomly 3 places per category 
 *      tags:
 *          - Place
 *      responses:
 *          200:
 *              description: get random places success.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Place'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */


    static FindManyPlaceRandom(req, res){
        PlaceService.findManyPlaceRandom(function(err, value){
            if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else{
                res.statusCode = 200
                res.send(value)
            }
        })
    }

/**
 * @swagger
 * /places/suggestions:
 *  get:
 *      summary: Get places near another place
 *      description: get suggestions of place near another place
 *      tags:
 *          - Place
 *      parameters:
 *          - in: query
 *            name: latCoordinate
 *            schema:
 *              type: number
 *            required: true
 *            description: lattitude coordinate of the place
 *          - in: query
 *            name: lonCoordinate
 *            schema:
 *              type: number
 *            required: true
 *            description: longitude coordinate of the place
 *      responses:
 *          200:
 *              description: Get nearest place successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Place'
 *          403:
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

    static findPlacesNear(req, res){
        PlaceService.findPlacesNear(Number(req.query.latCoordinate), Number(req.query.lonCoordinate), function(err, value){
            if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else if(err && err.type_error === "no-valid"){
                res.statusCode = 405
                res.send(err)
            }else{
                res.statusCode = 200
                res.send(value)
            }
        })
    }

    static findManyPlaces(req, res){
        console.log(req.query.hotelCategorie)
        const q = {search : req.query.search}
        if(req.query.notation){
            q.notation = req.query.notation
        }

        if(req.query.hotelCategorie){
            q.hotelCategorie = Number(req.query.hotelCategorie)
        }

        if(req.query.categorie){
            q.categorie = req.query.categorie
        }
        PlaceService.findManyPlaces(req.query.page, req.query.limit, q, null, function(err, value){
            if(err && err.type_error === "error-mongo"){
                res.statusCode = 500
                res.send(err)
            }else if(err && err.type_error === "no-valid"){
                res.statusCode = 405
                res.send(err)
            }else{
                res.statusCode = 200
                res.send(value)
            }
        })
    }
}