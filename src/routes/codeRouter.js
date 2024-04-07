// codeRouter.js
// Implementation of the Code router

const express = require('express');

const { redirectByCode } = require('../controllers/codeController.js');

const codeRouter = new express.Router();

codeRouter.get('/:code', redirectByCode);

module.exports = codeRouter;
