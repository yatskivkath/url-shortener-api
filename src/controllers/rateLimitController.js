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

module.exports = {
    getAllRateLimits,
};
