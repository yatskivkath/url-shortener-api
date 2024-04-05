// userRouter.js
// Implementation of the User router

const express = require('express');
const userController = require('../controllers/userController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const userRouter = express.Router();

userRouter.use(authMiddleware);

userRouter.get('/', userController.getAllUsers);

userRouter.post('/', userController.createUser);

module.exports = userRouter;
