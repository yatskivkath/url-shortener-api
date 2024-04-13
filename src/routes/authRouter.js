// authRouter.js
// Implementation of the Authentication Router

const express = require('express');

const authenticationController = require('../controllers/authenticationController.js');

const authRouter = new express.Router();

/**
 * @swagger
 * /api/auth/login:
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
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               example: johndoe@email.com
 *             password:
 *               type: string
 *               example: password
 *   responses:
 *      302:
 *        description: Redirect
 *      500:
 *        description: Server Error
 */
authRouter.post('/login', authenticationController.login);

module.exports = authRouter;
