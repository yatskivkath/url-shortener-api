// codeController.js
// Implmentation of the Code controller

const urlService = require('../services/urlService.js');
const codeService = require('../services/codeService.js');
const logger = require('../../logger.js');

async function redirectByCode(req, res, next) {
    try {
        const { code } = req.params;

        const url = await codeService.getUrlToRedirect(code);

        if (!url) {
            logger.log({
                level: 'warn',
                message: 'Url redirect failed',
                params: {
                    code,
                },
            });

            res.status(404).render('404');
        } else {
            await urlService.visitUrl(code);

            logger.log({
                level: 'info',
                message: 'Url redirect',
                params: {
                    code,
                    url,
                },
            });

            res.redirect(302, url);
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    redirectByCode,
};
