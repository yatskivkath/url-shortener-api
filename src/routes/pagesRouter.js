// pagesRouter.js
// Implementation of the ejs pages router

const express = require('express');

const pagesController = require('../controllers/pagesController.js');
const authenticationMiddleware = require('../middlewares/authenticationMiddleware.js');
const roleMiddleware = require('../middlewares/roleMiddleware.js');
const { USER_ROLES } = require('../constants/databaseConstants.js');

const pagesRouter = express.Router();

pagesRouter.get('/login', pagesController.loginPage);

pagesRouter.get('/register', pagesController.registerPage);

pagesRouter.use(authenticationMiddleware);

pagesRouter.get('/', pagesController.homePage);

pagesRouter.get('/dasboard', pagesController.dashboardPage);

pagesRouter.get(
    '/admin',
    roleMiddleware(USER_ROLES.ADMIN),
    pagesController.adminPage
);

pagesRouter.get('/url/customize', pagesController.urlCustomizePage);

pagesRouter.get('/url/edit/:id', pagesController.urlEditPage);

module.exports = pagesRouter;
