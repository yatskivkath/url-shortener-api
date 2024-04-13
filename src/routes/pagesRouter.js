// pagesRouter.js
// Implementation of the ejs pages router

const express = require('express');

const pagesController = require('../controllers/pagesController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const pagesRouter = express.Router();

pagesRouter.get('/login', pagesController.loginPage);

pagesRouter.get('/register', pagesController.registerPage);

pagesRouter.use(authMiddleware);

pagesRouter.get('/', pagesController.homePage);

pagesRouter.get('/dasboard', pagesController.dashboardPage);

pagesRouter.get('/admin', pagesController.adminPage);

module.exports = pagesRouter;
