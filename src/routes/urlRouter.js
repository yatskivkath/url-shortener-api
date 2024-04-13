// urlRouter.js
// Implementation of the Url router

const express = require('express');
const urlController = require('../controllers/urlController.js');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware.js');

const urlRouter = express.Router();

urlRouter.use(authenticationMiddleware);

/**
 * @swagger
 * /api/urls:
 *  post:
 *   tags:
 *   - Url
 *   summary: Create Short URL
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
 *             expirationDate:
 *               type: string
 *               format: date
 *               example: 2022-12-31
 *   responses:
 *      201:
 *        description: Created
 *      403:
 *        description: Not Access
 *      422:
 *       description: Unprocessable Entity
 *      500:
 *        description: Server Error
 */
urlRouter.post('/', urlController.createUrl);

/**
 * @swagger
 * '/api/urls/info/{code}':
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
 *      403:
 *        description: No Access
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
urlRouter.get('/info/:code', urlController.getUrl);

/**
 * @swagger
 * '/api/urls':
 *  get:
 *     tags:
 *     - Url
 *     summary: Get all URLs for the currrent user
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      403:
 *        description: No Access
 *      500:
 *        description: Server Error
 */
urlRouter.get('/', urlController.getAllUrlsByUserId);

/**
 * @swagger
 * /api/urls:
 *  post:
 *   tags:
 *   - Url
 *   summary: Update URL
 *   parameters:
 *     - name: id
 *       in: path
 *       description: The URL ID
 *       required: true
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
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
 *             expirationDate:
 *               type: string
 *               format: date
 *               example: 2022-12-31
 *             enabled:
 *               type: boolean
 *               example: true
 *   responses:
 *      201:
 *        description: Created
 *      403:
 *        description: Not Access
 *      422:
 *       description: Unprocessable Entity
 *      500:
 *        description: Server Error
 */
urlRouter.put('/:id', urlController.updateUrl);

/**
 * @swagger
 * '/api/urls/{id}':
 *  get:
 *     tags:
 *     - Url
 *     summary: Delete URL
 *     parameters:
 *     - name: id
 *       in: path
 *       description: The URL ID
 *       required: true
 *     responses:
 *      204:
 *        description: Deleted Successfully
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
urlRouter.delete('/:id', urlController.deleteUrl);

module.exports = urlRouter;
