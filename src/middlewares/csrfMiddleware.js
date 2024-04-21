const { generateHash } = require('../utils/hashFunctions.js');
const { Unauthorized } = require('../errors/errors.js');

function initCsrfTokenMiddleware(req, res, next) {
    if (!req.session.csrfToken) {
        req.session.csrfToken = generateHash(16);
    }

    return next();
}

function checkCsrfTokenMiddleware(req, res, next) {
    if (req.session.csrfToken !== req.body.csrfToken) {
        return next(new Unauthorized('CSRF Token is invalid'));
    } else {
        return next();
    }
}

module.exports = { initCsrfTokenMiddleware, checkCsrfTokenMiddleware };
