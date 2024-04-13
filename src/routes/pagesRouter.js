// pagesRouter.js
// Implementation of the ejs pages router

const express = require('express');
const pagesController = require('../controllers/pagesController.js');

const pagesRouter = express.Router();

pagesRouter.get('/', pagesController.homePage);

pagesRouter.get('/login', pagesController.loginPage);

pagesRouter.get('/register', pagesController.registerPage);

pagesRouter.get('/dasboard', pagesController.dashboardPage);

pagesRouter.get('/admin', pagesController.adminPage);

module.exports = pagesRouter;
