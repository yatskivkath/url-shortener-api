// authenticationMiddleware.js
// Implementation of the authentication middleware

const { Unauthorized } = require('../errors/errors');

async function sessionCookieMiddleware(req, res, next) {
    if (!req.session.userId) {
        if (req.originalUrl.startsWith('/api')) {
            return next(new Unauthorized());
        } else {
            res.redirect(302, '/sign-in');
        }
    } else {
        return next();
    }
}

module.exports = sessionCookieMiddleware;
