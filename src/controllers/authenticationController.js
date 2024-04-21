// authenticationController.js
// Implementation of the Authentication controller

const userService = require('../services/userService.js');
const authenticationService = require('../services/authenticationService.js');

async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await userService.getUserByEmail(email);

        const isLoggedIn = await authenticationService.comparePasswords(
            password,
            user.password
        );

        if (isLoggedIn) {
            const user = await userService.getUserByEmail(email);
            req.session.userId = user.id;
            req.session.user = user;

            res.redirect(302, '/');
        } else {
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
