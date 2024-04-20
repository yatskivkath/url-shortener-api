// rateLimitService.js
// Implement the Rate Limit Service

const redisClient = require('../redis/redisClient.js');
const config = require('../config/config.js')[process.env.NODE_ENV];
const permissionsService = require('./permissionsService.js');
const userService = require('./userService.js');
const urlService = require('./urlService.js');
const { actions, subjects } = require('../constants/permissionsConstants.js');

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

/**
 * Get all rate limits
 * @param {string} userId logged user id
 * @returns {Promise<{}>} rate limits
 */
async function getAllRateLimits(userId) {
    let cursor = 0;
    let keys = [];

    const user = await userService.getUserById(userId);

    permissionsService.checkPermissions(
        user,
        {},
        actions.READ,
        subjects.RATE_LIMIT
    );

    do {
        const response = await redisClient.scan(cursor, { MATCH: 'rl:*' });
        cursor = response.cursor;
        keys = keys.concat(response.keys);
    } while (cursor !== 0);

    const values = await redisClient.mGet(keys);

    let rateLimits = {};
    for (let i = 0; i < keys.length; i++) {
        const ttl = await redisClient.ttl(keys[i]);
        rateLimits[keys[i]] = {
            value: values[i],
            ttl,
        };
    }

    return rateLimits;
}

async function geAllRateLimitsByUserCodes(userId) {
    const urls = await urlService.getUrlsByUserPublic(userId);
    const codes = urls.map((url) => url.code);

    const rateLimits = {};
    for (const c of codes) {
        const key = `rl:code:${c}`;
        const value = await redisClient.get(key);
        const ttl = await redisClient.ttl(key);

        console.log(`Rate limit for code ${key}: ${value} (ttl: ${ttl})`);

        rateLimits[key] = {
            value,
            ttl,
        };
    }

    return rateLimits;
}

module.exports = {
    checkRateLimitCode,
    checkRateLimitUser,
    checkRateLimitIP,
    getAllRateLimits,
    geAllRateLimitsByUserCodes,
};
