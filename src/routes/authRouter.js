// authRouter.js
// Implementation of the Authentication Router

const express = require('express');

const authenticationController = require('../controllers/authenticationController.js');
const {
    checkCsrfTokenMiddleware,
} = require('../middlewares/csrfMiddleware.js');

const authRouter = new express.Router();

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *   tags:
 *   - Authentication
 *   summary: Log in a user
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
authRouter.post(
    '/login',
    checkCsrfTokenMiddleware,
    authenticationController.login
);

/**
 * @swagger
 * /api/auth/logout:
 *  post:
 *   tags:
 *   - Authentication
 *   summary: Log out a user
 *   requestBody:
 *     required: true
 *   responses:
 *      302:
 *        description: Redirect
 *      500:
 *        description: Server Error
 */
authRouter.post('/logout', authenticationController.logout);

module.exports = authRouter;
