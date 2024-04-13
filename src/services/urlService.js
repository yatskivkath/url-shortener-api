// urlService.js
// Implementation of the Url service

const urlRepository = require('../repositories/urlRepository.js');
const { generateHash } = require('../utils/hashFunctions.js');
const scopes = require('../constants/scopes.js');
const { URL_TYPES } = require('../constants/databaseConstants.js');
const { actions, subjects } = require('../constants/permissionsConstants.js');
const permissionsService = require('./permissionsService.js');
const userService = require('./userService.js');

/**
 * Create a new url
 * @param {Object} url url object
 * @param {string} url.redirectUrl url redirect url
 * @param {uuid} url.userId user id
 * @param {string} url.name url name
 * @param {string} url.code url code
 * @param {Date} url.expirationDate url expiration date
 * @param {string} url.type url type
 * @param {number} url.codeLength url code length
 * @param {uuid} userId logged in user id
 * @returns {Promise<Object>} created url
 * @throws {Error} if expiration date is not provided for temporary urls
 * @throws {Error} if expiration date is provided for permanent urls
 */
async function createUrl(url, userId) {
    const { redirectUrl, name, code, expirationDate, type, codeLength } = url;

    if (type === URL_TYPES.TEMPORARY && !expirationDate) {
        throw new Error('Expiration date is required for temporary urls');
    }

    if (type !== URL_TYPES.TEMPORARY && expirationDate) {
        throw new Error('Expiration date is not allowed for permanent urls');
    }

    const newUrl = await urlRepository.saveUrl({
        code: code ?? generateHash(codeLength),
        redirectUrl,
        userId,
        name,
        expirationDate,
        type,
    });

    return newUrl;
}

/**
 * Get a url by code
 * @param {string} code url code
 * @param {uuid} userId user id
 * @returns {Promise<Object>} url
 */
async function getUrl(code, userId) {
    const user = await userService.getUserById(userId);
    const url = await urlRepository.findUrlByCode(code);

    permissionsService.checkPermissions(user, url, actions.READ, subjects.URL);

    return url;
}

/**
 * Get a url public data by code
 * @param {string} code url code
 * @param {uuid} userId user id
 * @returns {Promise<Object>} url
 */
async function getUrlPublic(code, userId) {
    const user = await userService.getUserById(userId);
    const url = await urlRepository.findUrlByCode(code, scopes.url.public);

    permissionsService.checkPermissions(user, url, actions.READ, subjects.URL);

    return url;
}

/**
 * Get all urls by user id
 * @param {uuid} userId user id
 * @returns {Promise<Array>} urls
 */
async function getUrlsByUserPublic(userId) {
    const urls = await urlRepository.getAllUrlsByUserId(
        userId,
        scopes.url.public
    );

    return urls;
}

/**
 * Visit a url by code
 * @param {string} code url code
 * @returns {Promise<Object>} visited url
 * @throws {Error} if url was not found
 */
async function visitUrl(code) {
    const url = await urlRepository.findUrlByCode(code);

    if (!url) {
        throw new Error('Url was not found');
    }

    url.visits += 1;
    if (url.type === URL_TYPES.ONE_TIME) {
        url.enabled = false;
    }

    await urlRepository.updateUrl({
        id: url.id,
        visits: url.visits,
    });

    return url;
}

/**
 * Update a url by id
 * @param {Object} url url object
 * @param {uuid} url.id url id
 * @param {string} url.name url name
 * @param {string} url.enabled url enabled
 * @param {string} url.expirationDate url expiration date
 * @param {string} url.type url type
 * @param {uuid} userId logged in user id
 * @returns {Promise<Object>} updated url
 * @throws {Error} if expiration date is not provided temporary urls
 * @throws {Error} if expiration date is provided for permanent urls
 */
async function updateUrl(url, userId) {
    const { id, name, enabled, expirationDate, type } = url;

    if (type === URL_TYPES.TEMPORARY && !expirationDate) {
        throw new Error('Expiration date is required for temporary urls');
    }

    if (type !== URL_TYPES.TEMPORARY && expirationDate) {
        throw new Error('Expiration date is not allowed for permanent urls');
    }

    const updatedUrl = await urlRepository.updateUrl({
        id,
        expirationDate,
        enabled,
        type,
        name,
    });

    return updatedUrl;
}

/**
 * Delete a url by id
 * @param {uuid} urlId url id
 * @param {uuid} userId logged in user id
 * @returns {Promise<void>}
 */
async function deleteUrl(urlId, userId) {
    const deletedUrl = await urlRepository.deleteUrl(urlId);

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
