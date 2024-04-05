// authMiddleware.js
// Implementation of the authentication middleware

const authenticateService = require('../services/authenticateService');
const userService = require('../services/userService');

module.exports = async function (req, res, next) {
    const auth = req.header('Authorization');
    if (auth?.startsWith('Basic ')) {
        const [email, password] = auth.substring(6, auth.length).split(':');

        console.log(email, password);

        const user = await userService.getUserByEmail(email);
        const hasAccess = await authenticateService.comparePasswords(
            password,
            user.password
        );

        if (!hasAccess) {
            res.status(404).end('No Access');
        } else {
            req.session.userId = user.id;
            req.session.email = email;
            return next();
        }
    }

    res.status(401).end('Auth header not provided');
};
