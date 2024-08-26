/**
 * @swagger
 * /favorite/{id}:
 *  post:
 *      summary: create a folder
 *      description: create a folder to add favorite inside
 *      tags:
 *          - Favorite
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            description: id of place added in favorite
 *      responses:
 *          201:
 *              description: successfully add place in favorite.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Favorite'
 *          401: 
 *              description: Not Authorized
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /favorites:
 *  get:
 *      summary: get many favorites by user id and place or folder id
 *      description: find many favorites by user id and place or folder id
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Favorite
 *      parameters:
 *          - in: query
 *            name: page
 *            type: number
 *          - in: query
 *            name: limit
 *            type: number
 *          - in: query
 *            name: ids
 *            type: string
 *            description: id of place or folder
 *          - in: query
 *            name: search
 *            type: string
 *            description: find favorite by place's name
 *          - in : query
 *            name: categorie
 *            description: find favorite by place's categorie
 *            schema:
 *              type: string
 *              enum: [hotel,restaurant,activity]
 *      responses:
 *          200:
 *              description: favorites successfully finds.
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
 *                                      $ref : '#/components/schemas/Favorite'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /favorites/{id}:
 *  put:
 *      summary: Update favorite by favorite id
 *      description : Update favorite by favorite id
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          folder:
 *                            type: string
 *                            description: folder id
 *                          visited:
 *                            type: boolean
 *      tags:
 *          - Favorite
 *      responses:
 *          200:
 *              description: Favorite updated successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Favorite'
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
 * @swagger
 * /favorite/{id}:
 *  delete:
 *      summary: delete a favorite
 *      description: delete a favorite with place id
 *      tags:
 *          - Favorite
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            description: place id in favorite want delete
 *      responses:
 *          200:
 *              description: successfully delete favorite.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Favorite'
 *          401: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */