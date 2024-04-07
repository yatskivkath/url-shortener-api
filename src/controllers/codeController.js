// codeController.js
// Implmentation of the Code controller

import urlService from '../services/urlService.js';
const codeService = require('../services/codeService.js');

async function redirectByCode(req, res, next) {
    try {
        const { code } = req.params;

        const url = await codeService.getUrlToRedirect(code);

        if (!url) {
            res.status(404).end('Not Found');
        }

        await urlService.visitUrl(code);

        res.redirect(302, url);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    redirectByCode,
};
