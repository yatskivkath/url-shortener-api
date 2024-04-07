// userRouter.js
// Implementation of the User router

const express = require('express');
const userController = require('../controllers/userController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const userRouter = express.Router();

/**
 * @swagger
 * '/api/users':
 *  post:
 *     tags:
 *     - User
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *            properties:
 *              firstName:
 *                type: string
 *                example: John
 *              lastName:
 *                type: string
 *                example: Doe
 *              email:
 *                type: string
 *                example: joedoe20@mail.com
 *              password:
 *                type: string
 *                example: johnDoe20!@
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
userRouter.post('/', userController.createUser);

userRouter.use(authMiddleware);

/**
 * @swagger
 * '/api/users':
 *  get:
 *     tags:
 *     - User
 *     summary: Get all users
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
userRouter.get('/', userController.getAllUsers);

module.exports = userRouter;
