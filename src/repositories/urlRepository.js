// urlRepository.js
// Implementation of the Url repository

const models = require('../models/index.js');
const { URL_TYPES } = require('../constants/databaseConstants.js');

async function saveUrl(url, scope = 'publicScope') {
    const newUrl = await models.url.scope('publicScope').create({
        code: url.code,
        url: url.redirectUrl,
        user_id: url.userId,
        name: url.name,
        type: url.type ?? URL_TYPES.PERMANENT,
        expiration_date: url.expire,
    });

    return newUrl;
}

async function findUrlByCode(code, scope = 'defaultScope') {
    const url = await models.url.scope(scope).findOne({
        where: {
            code,
        },
    });

    return url;
}

async function getAllUrls(scope = 'defaultScope') {
    const urls = await models.url.scope(scope).findAll();

    return urls;
}

async function getAllUrlsByUserId(userId, scope = 'defaultScope') {
    const urls = await models.url.scope(scope).findAll({
        where: {
            user_id: userId,
        },
    });

    return urls ?? [];
}

async function updateUrl(url) {
    const updatedUrl = await models.url.update(
        {
            code: url.code,
            url: url.url,
            visits: url.visits,
            enabled: url.enabled,
            expiration_date: url.expiration_date,
            type: url.type,
        },
        {
            where: {
                id: url.id,
            },
        }
    );

    return updatedUrl;
}

async function deleteUrl(id) {
    const deletedUrl = await models.url.destroy({
        where: {
            id,
        },
    });

    return deletedUrl;
}

module.exports = {
    saveUrl,
    findUrlByCode,
    getAllUrls,
    getAllUrlsByUserId,
    updateUrl,
    deleteUrl,
};
