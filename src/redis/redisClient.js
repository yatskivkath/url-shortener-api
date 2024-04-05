//redisClient.js
// Redis client configuration

const { createClient } = require('redis');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const redisClient = createClient({
    url: config.redis.url,
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
