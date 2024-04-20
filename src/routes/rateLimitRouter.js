// rateLimitRouter.js
// Implementation of rate limiting router

const express = require('express');
const rateLimitController = require('../controllers/rateLimitController.js');

const rateLimitRouter = express.Router();

rateLimitRouter.get('/', rateLimitController.getAllRateLimits);

module.exports = rateLimitRouter;
