// config.js
// Configuration file for the application

require('dotenv').config();

module.exports = {
    development: {
        // Database configuration for development environment
        username: 'admin',
        password: 'admin',
        database: 'url_shortener',
        host: 'localhost',
        port: 5432,
        // url: process.env.DATABASE_URL,
        logging: false,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },

        // Server configuration for development environment
        server: {
            port: process.env.PORT || 3001,
        },

        // Redis configuration for development environment
        redis: {
            url: process.env.REDIS_URL,
        },

        rateLimit: {
            requestsLimitPerCode: 60,
            timeLimitPerCode: 3600,
            requestsLimitPerUser: 120,
            timeLimitPerUser: 3600,
            requestsLimitPerIP: 60,
            timeLimitPerIP: 3600,
        },
    },
    production: {
        // Database configuration for production environment
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },

        // Server configuration for production environment
        server: {
            port: process.env.PORT,
        },

        // Redis configuration for production environment
        redis: {
            url: process.env.REDIS_URL,
        },
    },
    isDevMode() {
        // Check if the environment is development
        return process.env.NODE_ENV === 'development';
    },
    isProdMode() {
        // Check if the environment is production
        return process.env.NODE_ENV === 'production';
    },
};
