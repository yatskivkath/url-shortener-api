// rateLimitService.js
// Implement the Rate Limit Service

const redisClient = require('../redis/redisClient.js');
const config = require('../config/config.js')[process.env.NODE_ENV];

async function checkRateLimit(key, limit, expires) {
    const rates = await redisClient.get(key);

    if (!rates) {
        await redisClient.set(key, 1, {
            EX: expires,
        });
        return true;
    } else if (rates < limit) {
        await redisClient.incr(key);
        return true;
    } else {
        return false;
    }
}

async function checkRateLimitCode(code) {
    const key = `rl:code:${code}`;
    return await checkRateLimit(
        key,
        config.rateLimit.requestsLimitPerCode,
        config.rateLimit.timeLimitPerCode
    );
}

async function checkRateLimitUser(userId) {
    const key = `rl:user:${userId}`;
    return await checkRateLimit(
        key,
        config.rateLimit.requestsLimitPerUser,
        config.rateLimit.timeLimitPerUser
    );
}

async function checkRateLimitIP(ipAddress) {
    const key = `rl:ip:${ipAddress}`;
    return await checkRateLimit(
        key,
        config.rateLimit.requestsLimitPerIP,
        config.rateLimit.timeLimitPerIP
    );
}

module.exports = {
    checkRateLimitCode,
    checkRateLimitUser,
    checkRateLimitIP,
};
