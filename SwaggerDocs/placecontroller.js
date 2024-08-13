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
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /places/random:
 *  get:
 *      summary: Get 3 places per categories with best notation
 *      description: obtain 3 places with bes notation and number of like per category 
 *      tags:
 *          - Place
 *      responses:
 *          200:
 *              description: get random places success.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              count:
 *                                  type: number
 *                              results:
 *                                  type: array
 *                                  items:
 *                                      $ref : '#/components/schemas/Place'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

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
 *              description: get random places success.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              count:
 *                                  type: number
 *                              results:
 *                                  type: array
 *                                  items:
 *                                      $ref : '#/components/schemas/Place'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /places:
 *  get:
 *      summary: Find places with filters
 *      description: get places using filter (by notation, hotelcategorie, categorie, name, city and county )
 *      tags:
 *          - Place
 *      parameters:
 *          - in: query
 *            name: page
 *            schema:
 *              type: number
 *            required: false
 *            description: The page number to retrieve
 *          - in: query
 *            name: limit
 *            schema:
 *              type: number
 *            required: false
 *            description: the number of element per page
 *          - in: query
 *            name: q
 *            schema:
 *              type: string
 *              exemple: activity
 *            required: false
 *            description: the number of element per page
 *      responses:
 *          200:
 *              description: get random places success.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              count:
 *                                  type: number
 *                              results:
 *                                  type: array
 *                                  items:
 *                                      $ref : '#/components/schemas/Place'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /place/{id}:
 *  put:
 *      summary: Update place
 *      description : Update place with provided, only owner of place can modified
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the place to update
 *      tags:
 *          - Place
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Place'
 *      responses:
 *          200:
 *              description: Place updated successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/User'
 *          401: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
* 
 * @swagger
 * /place/{id}:
 *  delete:
 *      summary: Delete one place
 *      description : delete one place by using ID, only owner of place can delete
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the place to delete
 *      tags:
 *          - Place
 *      responses:
 *          200:
 *              description: Place deleted successfully.
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

/**
* 
 * @swagger
 * /places:
 *  delete:
 *      summary: Deletes many places
 *      description : delete many places by using ID, only owner of places can delete
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: ids
 *            schema:
 *              type: array
 *            required: true
 *            description: array of places's id to delete
 *            items:
 *              type: string
 *      tags:
 *          - Place
 *      responses:
 *          200:
 *              description: Places deleted successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type : object
 *                          properties:
 *                              deletedCount:
 *                                  type: number
 *                              acknowledged:
 *                                  type: boolean
 *          403: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */