// urlService.js
// Implementation of the Url service

const urlRepository = require('../repositories/urlRepository.js');
const { generateHash } = require('../utils/hashFunctions.js');
const scopes = require('../constants/scopes.js');

async function createUrl(url) {
    const { redirectUrl, userId, name } = url;

    const newUrl = await urlRepository.saveUrl({
        code: generateHash(),
        redirectUrl,
        userId,
        name,
    });

    return newUrl;
}

async function getUrl(code) {
    const url = await urlRepository.findUrlByCode(code);

    return url;
}

async function getUrlPublic(code) {
    const url = await urlRepository.findUrlByCode(code, scopes.url.public);

    return url;
}

async function getUrlsByUserPublic(userId) {
    const urls = await urlRepository.getAllUrlsByUserId(
        userId,
        scopes.url.public
    );

    return urls;
}

async function visitUrl(code) {
    const url = await urlRepository.findUrlByCode(code);

    if (!url) {
        throw new Error('Url was not found');
    }

    url.visits += 1;
    await urlRepository.updateUrl(url);

    return url;
}

module.exports = {
    createUrl,
    getUrl,
    getUrlPublic,
    getUrlsByUserPublic,
    visitUrl,
};
