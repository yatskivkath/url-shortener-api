// rateLimitRouter.js
// Implementation of rate limiting router

const express = require('express');
const rateLimitController = require('../controllers/rateLimitController.js');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware.js');
const roleMiddleware = require('../middlewares/roleMiddleware.js');
const { USER_ROLES } = require('../constants//databaseConstants.js');

const rateLimitRouter = express.Router();

rateLimitRouter.use(authenticationMiddleware);

rateLimitRouter.use(roleMiddleware(USER_ROLES.ADMIN));

rateLimitRouter.get(
    '/',
    roleMiddleware(USER_ROLES.ADMIN),
    rateLimitController.getAllRateLimits
);

rateLimitRouter.delete(
    '/',
    roleMiddleware(USER_ROLES.ADMIN),
    rateLimitController.deleteRateLimit
);

module.exports = rateLimitRouter;
