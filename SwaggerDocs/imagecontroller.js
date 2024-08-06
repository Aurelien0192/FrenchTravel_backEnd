/**
 * @swagger
 * /image:
 *  post:
 *      summary: Uploads one Image
 *      description: Post one image about a place
 *      tags:
 *          - Image
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *          - in: formData
 *            name: image
 *            type: file
 *            description: The file to upload
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          place_id:
 *                            type: string
 *                          user_id:
 *                            type: string
 *      responses:
 *          201:
 *              description: Image successfully upload.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Image'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /images:
 *  post:
 *      summary: upload many Images
 *      description: Post many images about a place
 *      tags:
 *          - Image
 *      security:
 *          - bearerAuth: []
 *      consumes:
 *          - multipart/form-data
 *      parameters:
 *          - in: formData
 *            name: images
 *            type: array
 *            items :
 *                  type : file
 *                  description: The file to upload
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          place_id:
 *                            type: string
 *                          user_id:
 *                            type: string
 *      responses:
 *          201:
 *              description: Image successfully upload.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Image'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
* 
 * @swagger
 * /image/{id}:
 *  delete:
 *      summary: Delete one image
 *      description : delete one image by using ID, only owner of image and owner of place with image can delete
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Object ID of the image to delete
 *      tags:
 *          - Image
 *      responses:
 *          200:
 *              description: Image deleted successfully.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/Image'
 *          403: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */