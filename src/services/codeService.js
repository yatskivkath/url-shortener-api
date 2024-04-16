// codeService.js
// Implementation of the Code service

const urlService = require('./urlService.js');
const { NotFound, BadRequest } = require('../errors/errors.js');

/**
 * Get the URL to redirect to for a given code
 * @param {string} code url code
 * @returns {Promise<string | null>} the URL to redirect to or null if the code is not found or disabled
 */
async function getUrlToRedirect(code) {
    if (!code) {
        throw new BadRequest();
    }

    let url;
    try {
        url = await urlService.getUrlByCodePublic(code);
    } catch (error) {
        if (error instanceof NotFound) {
            return null;
        } else {
            throw error;
        }
    }

    if (!url?.active || !url?.enabled) {
        return null;
    }

    return url.url;
}

module.exports = {
    getUrlToRedirect,
};
