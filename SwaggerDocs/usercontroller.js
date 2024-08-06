/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login user
 *      description: Login user with the provided details
 *      tags:
 *          - Authentification
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

/**
 * @swagger
 * /logout:
 *  post:
 *      summary: Logout user
 *      description: Logout user with the provided details
 *      security:
 *          - bearerAuth: []
 *      tags:
 *          - Authentification
 *      requestBody:
 *          required: false
 *      responses:
 *          200:
 *              description: Logout successfully.
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
 *          403: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /user/{id}:
 *  get:
 *      summary: find user by id
 *      description : Create a new user with the provided details
 *      security:
 *          - bearerAuth: []
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
 *          200:
 *              description: User find successfully.
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
 * @swagger
 * /user:
 *  put:
 *      summary: Update user
 *      description : Update a user with provided
 *      security:
 *          - bearerAuth: []
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
 *          required: true
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
 * /profilePhoto/user:
 *  put:
 *      summary: change profile photo of user
 *      description : change profile photo of user
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: formData
 *            name: image
 *            type: file
 *            description: The file to upload
 *      tags:
 *          - User
 *      requestBody:
 *          required: false
 *      responses:
 *          200:
 *              description: profile photo user updated successfully.
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
 * /user:
 *  delete:
 *      summary: Delete one user
 *      description : delete one user by using ID
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the user to delete
 *      tags:
 *          - User
 *      responses:
 *          200:
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