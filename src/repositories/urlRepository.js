// urlRepository.js
// Implementation of the Url repository

const models = require('../models/index.js');
const { URL_TYPES } = require('../constants/databaseConstants.js');
const scopes = require('../constants/scopes.js');

async function saveUrl(url) {
    const newUrl = await models.url.create({
        code: url.code,
        url: url.redirectUrl,
        userId: url.userId,
        name: url.name,
        type: url.type ?? URL_TYPES.PERMANENT,
        expirationdDate: url.expirationDate,
    });

    return newUrl;
}

async function findUrlByCode(code, scope = scopes.url.default) {
    const url = await models.url.scope(scope).findOne({
        where: {
            code,
        },
    });

    return url;
}

async function getAllUrls(scope = scopes.url.default) {
    const urls = await models.url.scope(scope).findAll();

    return urls;
}

async function getAllUrlsByUserId(userId, scope = scopes.url.default) {
    const urls = await models.url.scope(scope).findAll({
        where: {
            userId: userId,
        },
    });

    return urls ?? [];
}

async function updateUrl(url) {
    await models.url.update(
        {
            code: url.code,
            url: url.url,
            visits: url.visits,
            enabled: url.enabled,
            expirationdDate: url.expirationDate,
            type: url.type,
        },
        {
            where: {
                id: url.id,
            },
        }
    );
}

async function deleteUrl(id) {
    const deletedUrl = await models.url.destroy({
        where: {
            id,
        },
    });

    return deletedUrl;
}

async function getUrl(id) {
    const url = await models.url.findOne({
        where: {
            id,
        },
    });

    return url;
}

module.exports = {
    saveUrl,
    findUrlByCode,
    getAllUrls,
    getAllUrlsByUserId,
    updateUrl,
    deleteUrl,
    getUrl,
};
