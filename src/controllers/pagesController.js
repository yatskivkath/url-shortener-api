// pagesController.js
// Implementation of the ejs pages controller

const urlService = require('../services/urlService.js');
const userService = require('../services/userService.js');

async function homePage(req, res) {
    const userId = req.session.userId;
    const urls = await urlService.getUrlsByUserPublic(userId);

    res.render('home', { urls });
}

async function loginPage(req, res) {
    res.render('login');
}

async function registerPage(req, res) {
    res.render('register');
}

async function dashboardPage(req, res) {
    res.render('dashboard');
}

async function adminPage(req, res) {
    const users = await userService.getUsersPublic();

    res.render('admin', { users });
}

module.exports = {
    homePage,
    loginPage,
    registerPage,
    dashboardPage,
    adminPage,
};
