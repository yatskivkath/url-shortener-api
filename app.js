// app.js
// Main entry point for the server

const express = require('express');

const webContext = require('./webContext.js');
const env = process.env.NODE_ENV || 'development';
const config = require('./src/config/config.js')[env];

const app = express();

webContext(app);

app.listen(config.server.port, () => {
    console.log('Server started');
});
