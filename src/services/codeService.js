// codeService.js
// Implementation of the Code service

const urlService = require('./urlService.js');

/**
 * Get the URL to redirect to for a given code
 * @param {string} code url code
 * @returns {Promise<string | null>} the URL to redirect to or null if the code is not found or disabled
 */
async function getUrlToRedirect(code) {
    const url = await urlService.getUrlPublic(code);

    if (!url || !url.active || !url.enabled) {
        return null;
    }

    return url.url;
}

module.exports = {
    getUrlToRedirect,
};
