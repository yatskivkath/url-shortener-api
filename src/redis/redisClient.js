//redisClient.js
// Redis client configuration

const { createClient } = require('redis');
const config = require('../config/config.js');

const redisClient = createClient({
    url: config.redis.url,
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
