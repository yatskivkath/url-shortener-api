// rateLimitMiddleware.js
// Implement the Rate Limit Middleware

const rateLimitService = require('../services/rateLimitService.js');
const urlService = require('../services/urlService.js');

async function rateLimitByCode(req, res, next) {
    const { code } = req.params;

    const isPassed = await rateLimitService.checkRateLimitCode(code);

    if (isPassed) {
        return next();
    } else {
        res.status(429).end('Rate Limit');
    }
}

async function rateLimitByUser(req, res, next) {
    const { code } = req.params;
    const url = urlService.getUrlByCode(code);

    if (!url) {
        res.status(404).end('Not Found');
    }

    const isPassed = await rateLimitService.checkRateLimitUser(url?.userId);

    if (isPassed) {
        return next();
    } else {
        res.status(429).end('Rate Limit');
    }
}

async function rateLimitByIP(req, res, next) {
    const ipAddress = req.ip;

    const isPassed = await rateLimitService.checkRateLimitIP(ipAddress);

    if (isPassed) {
        return next();
    } else {
        res.status(429).end('Rate Limit');
    }
}

module.exports = {
    rateLimitByCode,
    rateLimitByUser,
    rateLimitByIP,
};
