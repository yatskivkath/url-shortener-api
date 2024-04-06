// urlController.js
// Implementation of the Url controller

const urlService = require('../services/urlService.js');

async function createUrl(req, res) {
    const { url, name, code, expire, type, codeLength } = req.body;

    try {
        const newUrl = await urlService.createUrl({
            redirectUrl: url,
            userId: req.session.userId,
            name,
            code,
            expire,
            type,
            codeLength,
        });

        res.status(201).json(newUrl);
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
