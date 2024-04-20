// rateLimitCpntroller.js
// Implement the rate limit controller.

const rateLimitService = require('../services/rateLimitService.js');

async function getAllRateLimits(req, res, next) {
    try {
        const userId = req.session.userId;

        const rateLimits = await rateLimitService.getAllRateLimits(userId);

        res.json({
            rateLimits,
        });
    } catch (err) {
        next(err);
    }
}

async function getAllRateLimitByUser(req, res, next) {
    try {
        const userId = req.session.userId;
        const { key } = req.params;

        const rateLimit = await rateLimitService.geAllRateLimitsByUserCodes(
            userId,
            key
        );

        res.json({
            rateLimit,
        });
    } catch (err) {
        next(err);
    }
}

async function deleteRateLimit(req, res, next) {
    try {
        const userId = req.session.userId;
        const { key } = req.body;

        await rateLimitService.deleteRateLimit(userId, key);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllRateLimits,
    getAllRateLimitByUser,
    deleteRateLimit,
};
