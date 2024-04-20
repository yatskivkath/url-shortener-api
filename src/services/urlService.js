// urlService.js
// Implementation of the Url service

const urlRepository = require('../repositories/urlRepository.js');
const { generateHash } = require('../utils/hashFunctions.js');
const scopes = require('../constants/scopes.js');
const { URL_TYPES } = require('../constants/databaseConstants.js');
const { actions, subjects } = require('../constants/permissionsConstants.js');
const permissionsService = require('./permissionsService.js');
const userService = require('./userService.js');
const {
    NotFound,
    ValidationError,
    BadRequest,
    UnprocessableContent,
} = require('../errors/errors.js');

/**
 * Create a new url
 * @param {Object} url url object
 * @param {string} url.redirectUrl url redirect url
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

    if (!redirectUrl || !name) {
        throw new BadRequest();
    }

    if (type === URL_TYPES.TEMPORARY && !expirationDate) {
        throw new ValidationError();
    }

    if (type !== URL_TYPES.TEMPORARY && expirationDate) {
        throw new ValidationError();
    }

    const user = await userService.getUserById(userId);

    if (!user) {
        throw new NotFound('User was not found');
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
 * Get a url by id
 * @param {uuid} urlId url id
 * @param {uuid} userId logged in user id
 * @returns {Promise<Object>} url
 * @throws {Error} if url was not found
 * @throws {Error} if user does not have permissions
 * @throws {Error} if user is not found
 */
async function getUrlById(urlId, userId) {
    const user = await userService.getUserById(userId);
    const url = await urlRepository.getUrl(urlId);

    if (!url) {
        throw new NotFound('Url was not found');
    }

    permissionsService.checkPermissions(user, url, actions.READ, subjects.URL);

    return url;
}

/**
 * Get a url public data by code
 * @param {string} code url code
 * @returns {Promise<Object>} url
 */
async function getUrlByCodePublic(code) {
    const url = await urlRepository.findUrlByCode(code, scopes.url.public);

    if (!url) {
        throw new NotFound('Url was not found');
    }

    return url;
}

/**
 * Get all urls by user id
 * @param {uuid} userId logged in user id
 * @returns {Promise<Array>} urls
 */
async function getUrlsByUserPublic(userId) {
    const urls = await urlRepository.getAllUrlsByUserId(
        userId
        // scopes.url.public
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
        throw new NotFound('Url was not found');
    }

    url.visits += 1;

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
 * @returns {Promise<void>}
 * @throws {Error} if expiration date is not provided temporary urls
 * @throws {Error} if expiration date is provided for permanent urls
 */
async function updateUrl(data, userId) {
    const { id, name, enabled, expirationDate, type, code } = data;

    if (type === URL_TYPES.TEMPORARY && !expirationDate) {
        throw new ValidationError();
    }

    if (type !== URL_TYPES.TEMPORARY && expirationDate) {
        throw new ValidationError();
    }

    const user = await userService.getUserById(userId);
    const url = await urlRepository.getUrl(id);

    permissionsService.checkPermissions(
        user,
        url,
        actions.UPDATE,
        subjects.URL
    );

    if (code && url.code !== code) {
        const isCodeExist = await urlRepository.findUrlByCode(code);

        if (isCodeExist) {
            throw new UnprocessableContent('Code already exists');
        }
    }

    await urlRepository.updateUrl({
        id,
        expirationDate: type === URL_TYPES.TEMPORARY ? expirationDate : null,
        enabled,
        type,
        name,
        code,
    });
}

/**
 * Delete a url by id
 * @param {uuid} urlId url id
 * @param {uuid} userId logged in user id
 * @returns {Promise<void>}
 */
async function deleteUrl(urlId, userId) {
    const user = await userService.getUserById(userId);
    const url = await urlRepository.getUrl(urlId);

    if (!url) {
        throw new NotFound('Url was not found');
    }

    permissionsService.checkPermissions(
        user,
        url,
        actions.DELETE,
        subjects.URL
    );

    await urlRepository.deleteUrl(urlId);
}

/**
 * Delete all urls owned by a user
 * @param {id} id user id to deleet url from
 * @param {uuid} userId logged in user id
 */
async function deleteAllUsersUrl(id, userId) {
    const user = await userService.getUserById(userId);

    permissionsService.checkPermissions(
        user,
        { userId: id },
        actions.DELETE,
        subjects.URL
    );

    await urlRepository.deleteUrlsByUser(id);
}

module.exports = {
    createUrl,
    getUrlById,
    getUrlByCodePublic,
    getUrlsByUserPublic,
    visitUrl,
    updateUrl,
    deleteUrl,
    deleteAllUsersUrl,
};
