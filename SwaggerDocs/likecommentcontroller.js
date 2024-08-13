/**
 * @swagger
 * /like:
 *  post:
 *      summary: like a comment
 *      description: like a comment, you can only like a comment one time. update number of like in the comment
 *      tags:
 *          - LikeComment
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: query
 *            name: comment_id
 *            type: string
 *            description: comment where user want like
 *      responses:
 *          201:
 *              description: successfully liked comment.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/LikeComment'
 *          401: 
 *              description: Not Authorized
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */

/**
 * @swagger
 * /like/{id}:
 *  delete:
 *      summary: unlike a comment
 *      description: unlike one comment, update number of like in the comment
 *      tags:
 *          - LikeComment
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            type: string
 *            description: comment's id want to unlike
 *      responses:
 *          200:
 *              description: successfully delete comment.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref : '#/components/schemas/LikeComment'
 *          401: 
 *              description: Not Authorized
 *          404:
 *              $ref: '#/components/responses/NotFound'
 *          405:
 *              $ref: '#/components/responses/ValidationError'
 *          500:
 *              description : Internal server error
 */