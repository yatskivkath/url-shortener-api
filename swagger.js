const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Url Shortener API',
        version: '1.0.0',
        description:
            'This project provides a robust and efficient API for URL shortening app. Built on Node.js, this API offers fast and reliable URL shortening functionality, allowing users to create shortened versions of long URLs, which are easier to share and manage.',
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
