// authenticationController.js
// Implementation of the Authentication controller

const userService = require('../services/userService.js');
const authenticateService = require('../services/authenticateService.js');

async function login(req, res) {
    const { email, password } = req.body;

    const isLoggedIn = await authenticateService.comparePassword(
        email,
        password
    );

    if (isLoggedIn) {
        const user = await userService.getUserByEmail(email);
        req.session.userId = user.id;
        req.session.email = email;

        res.redirect(302, '/');
    } else {
        res.redirect(302, '/login');
    }
}

module.exports = {
    login,
};
