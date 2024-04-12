// codeRouter.js
// Implementation of the Code router

const express = require('express');

const { redirectByCode } = require('../controllers/codeController.js');
const {
    rateLimitByIP,
    rateLimitByCode,
    rateLimitByUser,
} = require('../middlewares/rateLimitMiddleware.js');

const codeRouter = new express.Router();

/**
 * @swagger
 * '/rediredt/{code}':
 *  get:
 *     tags:
 *     - Code
 *     summary: Redirect to the original URL
 *     parameters:
 *       - name: code
 *         in: path
 *         description: The shorted URL code
 *         example: google-short
 *         required: true
 *     responses:
 *      302:
 *        description: Redirect
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
codeRouter.get(
    '/:code',
    rateLimitByCode,
    rateLimitByUser,
    rateLimitByIP,
    redirectByCode
);

module.exports = codeRouter;
