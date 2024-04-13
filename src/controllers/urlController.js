// urlController.js
// Implementation of the Url controller

const urlService = require('../services/urlService.js');
const {
    urlSchemaCreate,
    urlSchemaUpdate,
} = require('../validators/urlSchema.js');

async function createUrl(req, res, next) {
    const data = req.body;
    try {
        urlSchemaCreate.validate(data);

        const userId = req.session.userId;

        const newUrl = await urlService.createUrl(data, userId);

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
    const userId = req.session.userId;

    try {
        await urlService.deleteUrl(id);

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

async function updateUrl(req, res, next) {
    const { id } = req.params;
    const data = req.body;

    try {
        urlSchemaUpdate.validate(data);

        data.id = id;

        const updatedUrl = await urlService.updateUrl(data);

        res.status(200).json(updatedUrl);
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
