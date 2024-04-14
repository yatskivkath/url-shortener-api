// urlController.js
// Implementation of the Url controller

const { ValidationError } = require('../errors/errors.js');
const urlService = require('../services/urlService.js');
const {
    urlSchemaCreate,
    urlSchemaUpdate,
} = require('../validators/urlSchema.js');

async function createUrl(req, res, next) {
    const data = req.body;

    try {
        const { error } = urlSchemaCreate.validate(data);
        if (error) {
            throw new ValidationError(error.message);
        }

        const userId = req.session.userId;

        const newUrl = await urlService.createUrl(
            {
                redirectUrl: data.redirectUrl,
                name: data.name,
                code: data.code,
                expirationDate: data.expirationDate,
                type: data.type,
                codeLength: data.codeLength,
            },
            userId
        );

        res.status(201).json({
            status: 'success',
            data: newUrl,
        });
    } catch (error) {
        next(error);
    }
}

async function getUrl(req, res, next) {
    const { code } = req.params;
    const userId = req.session.userId;

    try {
        const url = await urlService.getUrlPublic(code, userId);

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
    const userId = req.session.userId;

    try {
        const urls = await urlService.getUrlsByUserPublic(userId);

        res.status(200).json(urls);
    } catch (error) {
        next(error);
    }
}

async function deleteUrl(req, res, next) {
    const { id } = req.params;

    try {
        await urlService.deleteUrl(id);

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

async function updateUrl(req, res, next) {
    const { id } = req.params;
    const userId = req.session.userId;
    const data = req.body;

    try {
        const { error } = urlSchemaUpdate.validate(data);
        if (error) {
            throw new ValidationError(error.message);
        }

        data.id = id;

        await urlService.updateUrl(data, userId);

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
