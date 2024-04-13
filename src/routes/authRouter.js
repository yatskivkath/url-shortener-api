// authRouter.js
// Implementation of the Authentication Router

const express = require('express');

const authenticateController = require('../controllers/authenticateController.js');

const authRouter = new express.Router();

authRouter.post('/login', authenticateController.login);

module.exports = authRouter;
