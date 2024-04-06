// urlController.js
// Implementation of the Url controller

const urlService = require('../services/urlService.js');
const urlSchema = require('../validators/urlSchema.js');

async function createUrl(req, res) {
    try {
        const data = req.body;

        urlSchema.validate(data);

        const newUrl = await urlService.createUrl({
            ...data,
            userId: req.session.userId,
        });

        res.status(201).json({
            status: 'success',
            data: newUrl,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getUrl(req, res) {
    const { code } = req.params;

    try {
        const url = await urlService.getUrlPublic(code);

        if (!url) {
            res.status(404).json({ error: 'Url not found' });
        } else {
            res.status(200).json(url);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllUrlsByUserId(req, res) {
    const userId = req.session.userId;

    try {
        const urls = await urlService.getUrlsByUserPublic(userId);

        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteUrl(req, res) {
    const { id } = req.params;

    try {
        await urlService.deleteUrl(id);

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createUrl,
    getUrl,
    getAllUrlsByUserId,
    deleteUrl,
};
