// authenticationController.js
// Implementation of the Authentication controller

const userService = require('../services/userService.js');
const authenticationService = require('../services/authenticationService.js');
const logger = require('../../logger.js');
const { loginSchema } = require('../validators/authenticateSchema.js');
const { ValidationError } = require('../errors/errors.js');

async function login(req, res, next) {
    try {
        const data = req.body;

        delete data.csrfToken;

        const { error } = loginSchema.validate(data);
        if (error) {
            throw new ValidationError(error.message);
        }

        const { email, password } = data;

        const user = await userService.getUserByEmail(email);

        const isLoggedIn = await authenticationService.comparePasswords(
            password,
            user.password
        );

        if (isLoggedIn) {
            const user = await userService.getUserByEmail(email);
            req.session.userId = user.id;
            req.session.user = user;

            logger.log({
                level: 'info',
                message: 'User logged in',
                params: {
                    email,
                },
            });

            res.redirect(302, '/');
        } else {
            logger.log({
                level: 'warn',
                message: 'User login failed',
                params: {
                    email,
                },
            });

            res.redirect(302, '/sign-in');
        }
    } catch (error) {
        next(error);
    }
}

async function logout(req, res, next) {
    try {
        req.session.destroy((err) => {
            if (err) {
                next(err);
            }

            res.redirect(302, '/sign-in');
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    login,
    logout,
};
