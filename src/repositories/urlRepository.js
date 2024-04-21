// urlRepository.js
// Implementation of the Url repository

const models = require('../models/index.js');
const { sequelize } = require('../models/index.js');
const { URL_TYPES } = require('../constants/databaseConstants.js');
const { WEB_DOMAIN } = require('../constants/domain.js');
const scopes = require('../constants/scopes.js');

async function saveUrl(url) {
    const newUrl = await models.url.create({
        code: url.code,
        url: url.redirectUrl,
        userId: url.userId,
        name: url.name,
        type: url.type ?? URL_TYPES.PERMANENT,
        expirationDate: url.expirationDate,
    });

    return newUrl?.toJSON();
}

async function findUrlByCode(code, scope = scopes.url.default) {
    const url = await models.url.scope(scope).findOne({
        where: {
            code,
        },
    });

    return url?.toJSON();
}

async function getAllUrls(scope = scopes.url.default) {
    const urls = await models.url.scope(scope).findAll();

    return urls?.map((u) => u.toJSON());
}

async function getAllUrlsByUserId(userId, scope = scopes.url.default) {
    const urls = await models.url.scope(scope).findAll({
        where: {
            userId: userId,
        },
    });

    return urls?.map((u) => u.toJSON()) ?? [];
}

async function updateUrl(url) {
    await models.url.update(
        {
            code: url.code,
            url: url.url,
            visits: url.visits,
            enabled: url.enabled,
            expirationDate: url.expirationDate,
            type: url.type,
            name: url.name,
        },
        {
            where: {
                id: url.id,
            },
        }
    );
}

async function deleteUrl(id) {
    await models.url.destroy({
        where: {
            id,
        },
    });
}

async function getUrl(id) {
    const url = await models.url.findOne({
        where: {
            id,
        },
    });

    return url?.toJSON();
}

async function deleteUrlsByUser(userId) {
    await models.url.destroy({
        where: {
            userId,
        },
    });
}

async function getUrls(options) {
    const urls = await sequelize.query(
        'SELECT * FROM urls ORDER BY visits DESC LIMIT :limit',
        {
            replacements: { limit: options.limit },
            type: sequelize.QueryTypes.SELECT,
        }
    );

    return urls.map((u) => {
        return {
            id: u.id,
            code: u.code,
            url: u.url,
            visits: u.visits,
            enabled: u.enabled,
            expirationDate: u.expiration_date,
            shortUrl: `${WEB_DOMAIN}/redirect/${u.code}`,
            type: u.type,
            name: u.name,
            userId: u.user_id,
        };
    });
}

async function getUrlsByUser(options) {
    const urls = await sequelize.query(
        'SELECT * FROM urls WHERE user_id = :userId ORDER BY visits DESC LIMIT :limit',
        {
            replacements: { userId: options.userId, limit: options.limit },
            type: sequelize.QueryTypes.SELECT,
        }
    );

    return urls.map((u) => {
        return {
            id: u.id,
            code: u.code,
            url: u.url,
            visits: u.visits,
            enabled: u.enabled,
            expirationDate: u.expiration_date,
            shortUrl: `${WEB_DOMAIN}/redirect/${u.code}`,
            type: u.type,
            name: u.name,
            userId: u.user_id,
        };
    });
}

module.exports = {
    saveUrl,
    findUrlByCode,
    getAllUrls,
    getAllUrlsByUserId,
    updateUrl,
    deleteUrl,
    getUrl,
    deleteUrlsByUser,
    getUrls,
    getUrlsByUser,
};
