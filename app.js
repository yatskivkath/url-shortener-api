// app.js
// Main entry point for the server

const express = require('express');

const webContext = require('./webContext.js');

const app = express();

webContext(app);

app.listen(3001, () => {
    console.log('Server started');
});
