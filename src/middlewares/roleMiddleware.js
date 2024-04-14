// authorizationsMiddleware.js
// Implementation of the RBAC authorization middleware

const roleMiddleware = (role) => (req, res, next) => {
    if (req.session.user.role !== role) {
        res.status(403).end('No Access');
    }

    return next();
};

module.exports = roleMiddleware;
