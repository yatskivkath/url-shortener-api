// codeService.js
// Implementation of the Code service

const urlService = require('./urlService.js');

async function getUrlToRedirect(code) {
    const url = await urlService.getUrl(code);

    if (!url || !url.enabled) {
        return null;
    }

    return url.url;
}

module.exports = {
    getUrlToRedirect,
};
