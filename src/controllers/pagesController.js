// pagesController.js
// Implementation of the ejs pages controller

const urlService = require('../services/urlService.js');
const userService = require('../services/userService.js');

async function homePage(req, res) {
    const userId = req.session.userId;
    const urls = await urlService.getUrlsByUserPublic(userId);

    res.render('home', { urls });
}

async function signInPage(req, res) {
    res.render('sign-in');
}

async function signUpPage(req, res) {
    res.render('sign-up');
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

async function urlCustomizePage(req, res) {
    res.render('url-customize');
}

async function urlEditPage(req, res) {
    const { id } = req.params;
    const userId = req.session.userId;

    const url = await urlService.getUrlById(id, userId);

    res.render('url-edit', { url });
}

module.exports = {
    homePage,
    signInPage,
    signUpPage,
    registerPage,
    dashboardPage,
    adminPage,
    urlCustomizePage,
    urlEditPage,
};
