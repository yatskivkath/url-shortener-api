const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const API_DOMAIN = config.domain ?? 'http://localhost:8080';
const WEB_DOMAIN = config.domain ?? 'http://localhost:3001';

module.exports = {
    API_DOMAIN,
    WEB_DOMAIN,
};
