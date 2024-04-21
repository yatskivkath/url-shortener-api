// authorizationsMiddleware.js
// Implementation of the RBAC authorization middleware

const roleMiddleware = (role) => (req, res, next) => {
    if (req.session.user.role !== role) {
        return next(new Error('No Access'));
    } else {
        return next();
    }
};

module.exports = roleMiddleware;
