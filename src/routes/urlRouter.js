// urlRouter.js
// Implementation of the Url router

const express = require('express');
const urlController = require('../controllers/urlController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const urlRouter = express.Router();

urlRouter.use(authMiddleware);

/**
 * @swagger
 * /urls:
 *  post:
 *   tags:
 *   - Url
 *   summary: Create a new short URL
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           required:
 *             - url
 *             - name
 *           properties:
 *             url:
 *               type: string
 *               example: https://www.google.com
 *             name:
 *               type: string
 *               example: Google
 *             type:
 *               type: string
 *               enum: [P, T, OT]
 *               example: P
 *             code:
 *               type: string
 *               example: google-short
 *             expire:
 *               type: string
 *               format: date
 *               example: 2022-12-31
 *   responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
urlRouter.post('/', urlController.createUrl);

/**
 * @swagger
 * '/urls/info/{code}':
 *  get:
 *     tags:
 *     - Url
 *     summary: Get URL info
 *     parameters:
 *       - name: code
 *         in: path
 *         description: The shorted URL code
 *         example: google-short
 *         required: true
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
urlRouter.get('/info/:code', urlController.getUrl);

/**
 * @swagger
 * '/urls':
 *  get:
 *     tags:
 *     - Url
 *     summary: Get all URLs for the currrent user
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
urlRouter.get('/', urlController.getAllUrlsByUserId);

urlRouter.delete('/:id', urlController.deleteUrl);

module.exports = urlRouter;
