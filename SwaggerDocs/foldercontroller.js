/**
 * @swagger
 * /folder:
 *  post:
 *      summary: create a folder
 *      description: create a folder to add favorite inside
 *      tags:
 *          - Folder
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                            type: string 
 *      responses:
 *          201:
 *              description: successfully create folder.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Folder'
 *          401: 
 *              description: Not Authorized
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */
/**
 * @swagger
 * /folder/{id}:
 *  get:
 *      summary: get one folder by folder id
 *      description: find one folder by folder id. populate with favorite
 *      tags:
 *          - Folder
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            description: id of folder
 *      responses:
 *          200:
 *              description: successfully find folder.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Folder'
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
 * /folders:
 *  get:
 *      summary: get many folders by user id
 *      description: find many folders by user id
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Folder
 *      parameters:
 *          - in: query
 *            name: page
 *            type: number
 *          - in: query
 *            name: limit
 *            type: number
 *      responses:
 *          200:
 *              description: folders successfully finds.
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
 *                                      $ref : '#/components/schemas/Folder'
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /folder/{id}:
 *  put:
 *      summary: Update name of folder
 *      description : update name of folder
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
 *                          name:
 *                            type: string
 *      tags:
 *          - Folder
 *      responses:
 *          200:
 *              description: Folder name updated successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Folder'
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
 * /folder/{id}:
 *  delete:
 *      summary: delete a folder
 *      description: delete a folder, deletion of folder delete all favorite inside
 *      tags:
 *          - Folder
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            description: folder's id
 *      responses:
 *          200:
 *              description: successfully delete folder.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Folder'
 *          401: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */