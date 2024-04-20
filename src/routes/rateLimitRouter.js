// rateLimitRouter.js
// Implementation of rate limiting router

const express = require('express');
const rateLimitController = require('../controllers/rateLimitController.js');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware.js');
const { USER_ROLES } = require('../constants//databaseConstants.js');
const roleMiddleware = require('../middlewares/roleMiddleware.js');

const rateLimitRouter = express.Router();

rateLimitRouter.use(authenticationMiddleware);

rateLimitRouter.use(roleMiddleware(USER_ROLES.ADMIN));

rateLimitRouter.get('/', rateLimitController.getAllRateLimits);

rateLimitRouter.delete('/', rateLimitController.deleteRateLimit);

module.exports = rateLimitRouter;
