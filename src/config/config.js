// config.js
// Configuration file for the application

require('dotenv').config();

module.exports = {
    development: {
        // Database configuration for development environment
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
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
            port: 8080,
        },

        // Redis configuration for development environment
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
        },
    },
    production: {
        // Database configuration for production environment
        host: 'localhost',
        port: 5432,
        username: 'your_prod_username',
        password: 'your_prod_password',
        database: 'your_prod_database_name',

        // Server configuration for production environment
        server: {
            port: 8080,
        },

        // Redis configuration for production environment
        redis: {
            host: 'localhost',
            port: 6379,
            password: 'your_prod_password',
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
