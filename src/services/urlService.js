// urlService.js
// Implementation of the Url service

const urlRepository = require('../repositories/urlRepository.js');
const { generateHash } = require('../utils/hashFunctions.js');
const scopes = require('../constants/scopes.js');
const { URL_TYPES } = require('../constants/databaseConstants.js');

async function createUrl(url) {
    const { redirectUrl, userId, name, code, expire, type, codeLength } = url;

    const newUrl = await urlRepository.saveUrl({
        code: code ?? generateHash(codeLength),
        redirectUrl,
        userId,
        name,
        expire,
        type,
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
    if (url.type === URL_TYPES.ONE_TIME) {
        url.enabled = false;
    }

    await urlRepository.updateUrl(url);

    return url;
}

async function updateUrl(url) {
    const { enabled, expirationDate, type } = url;

    if (type === URL_TYPES.TEMPORARY && !expirationDate) {
        throw new Error('Expiration date is required for temporary urls');
    }

    if (type !== URL_TYPES.TEMPORARY && expirationDate) {
        throw new Error('Expiration date is not allowed for permanent urls');
    }

    const updatedUrl = await urlRepository.updateUrl({
        expirationDate,
        enabled,
        type,
    });

    return updatedUrl;
}

async function deleteUrl(id) {
    const deletedUrl = await urlRepository.deleteUrl(id);

    if (!deletedUrl) {
        throw new Error('Url was not found');
    }
}

module.exports = {
    createUrl,
    getUrl,
    getUrlPublic,
    getUrlsByUserPublic,
    visitUrl,
    updateUrl,
    deleteUrl,
};
