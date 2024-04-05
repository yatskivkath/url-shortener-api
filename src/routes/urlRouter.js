// urlRouter.js
// Implementation of the Url router

const express = require('express');
const urlController = require('../controllers/urlController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const urlRouter = express.Router();

urlRouter.use(authMiddleware);

urlRouter.post('/', urlController.createUrl);

urlRouter.get('/info/:code', urlController.getUrl);

urlRouter.get('/user/:userId', urlController.getAllUrlsByUserId);

module.exports = urlRouter;
