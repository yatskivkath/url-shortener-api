// urlController.js
// Implementation of the Url controller

const { ValidationError } = require('../errors/errors.js');
const urlService = require('../services/urlService.js');
const {
    urlSchemaCreate,
    urlSchemaUpdate,
    urlSchemaGet,
    urlSchemaDelete,
} = require('../validators/urlSchema.js');
const logger = require('../../logger.js');

async function createUrl(req, res, next) {
    try {
        const data = req.body;

        delete data.csrfToken;

        const { error } = urlSchemaCreate.validate(data);
        if (error) {
            throw new ValidationError(error.message);
        }

        const userId = req.session.userId;

        const newUrl = await urlService.createUrl(data, userId);

        logger.log({
            level: 'info',
            message: 'Url created',
            params: {
                url: newUrl,
            },
        });

        res.status(201).json({
            status: 'success',
            data: newUrl,
        });
    } catch (error) {
        next(error);
    }
}

async function getUrl(req, res, next) {
    try {
        const { code } = req.params;
        const userId = req.session.userId;

        const { error } = urlSchemaGet.validate({ code });
        if (error) {
            throw new ValidationError(error.message);
        }

        const url = await urlService.getUrlByCodePublic(code, userId);

        if (!url) {
            res.status(404).json({ error: 'Url not found' });
        } else {
            res.status(200).json(url);
        }
    } catch (error) {
        next(error);
    }
}

async function getAllUrlsByUserId(req, res, next) {
    try {
        const userId = req.session.userId;

        const urls = await urlService.getUrlsByUserPublic(userId);

        res.status(200).json(urls);
    } catch (error) {
        next(error);
    }
}

async function deleteUrl(req, res, next) {
    try {
        const userId = req.session.userId;
        const { id } = req.params;

        const { error } = urlSchemaDelete.validate({ id });
        if (error) {
            throw new ValidationError(error.message);
        }

        await urlService.deleteUrl(id, userId);

        logger.log({
            level: 'info',
            message: 'Url deleted',
            params: {
                id,
            },
        });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

async function updateUrl(req, res, next) {
    try {
        const { id } = req.params;
        const userId = req.session.userId;
        const data = req.body;

        delete data.csrfToken;

        const { error } = urlSchemaUpdate.validate(data);
        if (error) {
            throw new ValidationError(error.message);
        }

        data.id = id;

        await urlService.updateUrl(data, userId);

        logger.log({
            level: 'info',
            message: 'Url updated',
            params: {
                id,
                data,
            },
        });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUrl,
    getUrl,
    getAllUrlsByUserId,
    deleteUrl,
    updateUrl,
};
