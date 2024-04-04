// app.js
// Main entry point for the server

const express = require('express');

const webContext = require('./src/webContext.js');

const app = express();

webContext(app);

app.listen(3001, () => {
    console.log('Server started');
});
