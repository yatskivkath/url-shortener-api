// urlController.js
// Implementation of the Url controller

const urlService = require('../services/urlService.js');

async function createUrl(req, res) {
    const { url } = req.body;

    try {
        const newUrl = await urlService.createUrl(url);

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
    const { userId } = req.params;

    try {
        const urls = await urlService.getUrlsByUserPublic(userId);

        res.status(200).json(urls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createUrl,
    getUrl,
    getAllUrlsByUserId,
};
