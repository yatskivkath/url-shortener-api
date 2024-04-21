// app.js
// Main entry point for the server

const express = require('express');

const webContext = require('./webContext.js');

const app = express();

webContext(app);

app.listen(process.env.PORT, () => {
    console.log('Server started');
});
