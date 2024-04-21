// pagesController.js
// Implementation of the ejs pages controller

const urlService = require('../services/urlService.js');
const userService = require('../services/userService.js');
const rateLimitService = require('../services/rateLimitService.js');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

async function homePage(req, res, next) {
    try {
        const userId = req.session.userId;
        const csrfToken = req.session.csrfToken;

        const urls = await urlService.getUrlsByUserPublic(userId);

        res.render('home', { urls, csrfToken });
    } catch (error) {
        next(error);
    }
}

async function signInPage(req, res, next) {
    try {
        const csrfToken = req.session.csrfToken;

        res.render('sign-in', { csrfToken });
    } catch (error) {
        next(error);
    }
}

async function signUpPage(req, res, next) {
    try {
        const csrfToken = req.session.csrfToken;
        res.render('sign-up', { csrfToken });
    } catch (error) {
        next(error);
    }
}

async function dashboardPage(req, res, next) {
    try {
        const userId = req.session.userId;

        const topUrls = await urlService.getTopUrls();
        const allUserUrls = await urlService.getUrlsByUserPublic(userId);

        const totalUserUrls = allUserUrls.length;
        const totalUserVisits = allUserUrls.reduce(
            (prev, cur) => (prev += cur.visits),
            0
        );

        const rateLimitsUser =
            await rateLimitService.geAllRateLimitsByUserCodes(userId);
        const maxRateLimit = config.rateLimit.requestsLimitPerCode;

        const topUserUrls = (await urlService.getTopUrls(5, userId)).map(
            (url) => {
                url.rateLimit = rateLimitsUser[url.code];
                url.rateLimit.value = parseInt(url.rateLimit.value ?? 0);

                return url;
            }
        );

        res.render('dashboard', {
            topUrls,
            topUserUrls,
            totalUserUrls,
            totalUserVisits,
            maxRateLimit,
        });
    } catch (error) {
        next(error);
    }
}

async function adminPage(req, res, next) {
    try {
        const userId = req.session.userId;
        const csrfToken = req.session.csrfToken;

        const users = await userService.getUsersPublic();
        const rateLimits = await rateLimitService.getAllRateLimits(userId);

        const maxRateLimit = config.rateLimit.requestsLimitPerCode;

        res.render('admin', { users, rateLimits, maxRateLimit, csrfToken });
    } catch (error) {
        next(error);
    }
}

async function urlCustomizePage(req, res, next) {
    try {
        const csrfToken = req.session.csrfToken;
        res.render('url-customize', { csrfToken });
    } catch (error) {
        next(error);
    }
}

async function urlEditPage(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        const csrfToken = req.session.csrfToken;

        const url = await urlService.getUrlById(id, userId);

        res.render('url-edit', { url, csrfToken });
    } catch (error) {
        next(error);
    }
}

async function adminCreateUserPage(req, res, next) {
    try {
        const csrfToken = req.session.csrfToken;

        res.render('admin-create', { csrfToken });
    } catch (error) {
        next(error);
    }
}

async function usersPage(req, res, next) {
    try {
        const users = await userService.getUsersPublic();

        res.render('users', { users });
    } catch (error) {
        next(error);
    }
}

async function userPage(req, res, next) {
    try {
        const { id } = req.params;

        const user = await userService.getUserById(id);
        const urls = (await urlService.getUrlsByUserPublic(id)).map((url) => {
            delete url.expirationDate;
            delete url.active;
            delete url.expired;

            return url;
        });

        res.render('user', { user, urls });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    homePage,
    signInPage,
    signUpPage,
    dashboardPage,
    adminPage,
    urlCustomizePage,
    urlEditPage,
    adminCreateUserPage,
    usersPage,
    userPage,
};
