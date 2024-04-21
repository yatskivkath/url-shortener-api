// rateLimitCpntroller.js
// Implement the rate limit controller.

const rateLimitService = require('../services/rateLimitService.js');
const logger = require('../../logger.js');

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

        const rateLimit =
            await rateLimitService.geAllRateLimitsByUserCodes(userId);

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

        logger.log({
            level: 'info',
            message: 'Rate limit deleted',
            params: {
                key,
            },
        });

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
