// rateLimitRouter.js
// Implementation of rate limiting router

const express = require('express');
const rateLimitController = require('../controllers/rateLimitController.js');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware.js');

const rateLimitRouter = express.Router();

rateLimitRouter.use(authenticationMiddleware);

rateLimitRouter.get('/', rateLimitController.getAllRateLimits);

module.exports = rateLimitRouter;
