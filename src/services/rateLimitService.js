// rateLimitService.js
// Implement the Rate Limit Service

const redisClient = require('../redis/redisClient.js');
const config = require('../config/config.js')[process.env.NODE_ENV];

/**
 * Check the rate limit
 * @param {string} key rate limit key
 * @param {number} limit rate limit
 * @param {number} expires rate limit expiration time in seconds
 * @returns {Promise<boolean>} true if the rate limit is not exceeded, false otherwise
 */
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

/**
 * Check the rate limit for a code
 * @param {string} code url code
 * @returns {Promise<boolean>} true if the rate limit is not exceeded, false otherwise
 */
async function checkRateLimitCode(code) {
    const key = `rl:code:${code}`;
    return await checkRateLimit(
        key,
        config.rateLimit.requestsLimitPerCode,
        config.rateLimit.timeLimitPerCode
    );
}

/**
 * Check the rate limit for a user
 * @param {string} userId user id
 * @returns {Promise<boolean>} true if the rate limit is not exceeded, false otherwise
 */
async function checkRateLimitUser(userId) {
    const key = `rl:user:${userId}`;
    return await checkRateLimit(
        key,
        config.rateLimit.requestsLimitPerUser,
        config.rateLimit.timeLimitPerUser
    );
}

/**
 * Check the rate limit for an IP address
 * @param {string} ipAddress IP address
 * @returns {Promise<boolean>} true if the rate limit is not exceeded, false otherwise
 */
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
