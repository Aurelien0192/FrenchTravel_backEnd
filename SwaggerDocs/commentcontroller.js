/**
 * @swagger
 * /comment:
 *  post:
 *      summary: add comment to a place
 *      description: add a comment to a place, one user can only post one comment per place
 *      tags:
 *          - Comment
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: place_id
 *            type: string
 *            description: id of place where user will comment
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          comment:
 *                            type: string
 *      responses:
 *          201:
 *              description: comment successfully created.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Comment'
 *          401: 
 *              description: Not Authorized
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /responseComment/{id}:
 *  post:
 *      summary: respond to one comment
 *      description: respond to a comment of another user. Only owner of place can respond to a comment on his place
 *      tags:
 *          - Comment
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            description: id of comment to respond
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          comment:
 *                            type: string
 *      responses:
 *          201:
 *              description: successfully respond to comment.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Comment'
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
 * /comment/{id}:
 *  get:
 *      summary: get one comment by id
 *      description: find one comment with this id, populate on response of comment
 *      tags:
 *          - Comment
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            description: id of comment to find
 *      responses:
 *          200:
 *              description: Comment successfully find.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Comment' 
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /comments:
 *  get:
 *      summary: get many comments by user or place
 *      description: get many comments by filter, populate on user or place and response
 *      tags:
 *          - Comment
 *      parameters:
 *          - in: query
 *            name: page
 *            type: number
 *          - in: query
 *            name: limit
 *            type: number
 *          - in: query
 *            name: user_id
 *            type: string
 *            description: id of user who post comments
 *          - in: query
 *            name: place_id
 *            type: string
 *            description: id of place where comments are
 *          - in: query
 *            name: visitor_id
 *            type: string
 *            description: id of user connected and visited the website
 *          - in: query
 *            name: options
 *            description: if who want populate by user or place
 *            schema:
 *              type: string
 *              enum: [populateuser_id, populateplace_id]
 *      responses:
 *          200:
 *              description: Comments successfully finds.
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
 *                                      $ref : '#/components/schemas/Comment'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /commentsByOwner:
 *  get:
 *      summary: find comments by owner
 *      description: find all comments post in places belonging of one owner
 *      tags:
 *          - Comment
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: page
 *            type: number
 *          - in: query
 *            name: limit
 *            type: number
 *          - in: query
 *            name: search
 *            description: finds comment by name of place or username of poster
 *      responses:
 *          200:
 *              description: Comments successfully finds.
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
 *                                      $ref : '#/components/schemas/Comment'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /comment/{id}:
 *  delete:
 *      summary: delete one comment
 *      description: delete one comment, delete associated like
 *      tags:
 *          - Comment
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            description: id of comment to respond
 *      responses:
 *          201:
 *              description: successfully delete comment.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Comment'
 *          401: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */