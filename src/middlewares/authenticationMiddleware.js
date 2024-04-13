// authenticationMiddleware.js
// Implementation of the authentication middleware

async function sessionCookieMiddleware(req, res, next) {
    if (!req.session.userId) {
        if (req.originalUrl.startsWith('/api')) {
            res.status(403).end('No Access');
        } else {
            res.redirect(302, '/login');
        }
    } else {
        return next();
    }
}

module.exports = sessionCookieMiddleware;
