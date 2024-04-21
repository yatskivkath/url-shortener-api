// pagesController.js
// Implementation of the ejs pages controller

const urlService = require('../services/urlService.js');
const userService = require('../services/userService.js');
const rateLimitService = require('../services/rateLimitService.js');

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
    const userId = req.session.userId;

    const topUrls = await urlService.getTopUrls(5);
    const topUserUrls = await urlService.getTopUrls(5, userId);
    const allUserUrls = await urlService.getUrlsByUserPublic(userId);

    const totalUserUrls = allUserUrls.length;
    const totalUserVisits = allUserUrls.reduce(
        (prev, cur) => (prev += cur.visits),
        0
    );

    const rateLimitsUser =
        await rateLimitService.geAllRateLimitsByUserCodes(userId);

    console.log(rateLimitsUser);

    res.render('dashboard', {
        topUrls,
        topUserUrls,
        totalUserUrls,
        totalUserVisits,
    });
}

async function adminPage(req, res) {
    const userId = req.session.userId;

    const users = await userService.getUsersPublic();
    const rateLimits = await rateLimitService.getAllRateLimits(userId);

    res.render('admin', { users, rateLimits });
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

async function adminCreateUserPage(req, res) {
    res.render('admin-create');
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
    adminCreateUserPage,
};
