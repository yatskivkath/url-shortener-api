// webContext.js
// App web context configuration

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis');

const redisClient = require('./redis/redisClient.js');

// Initialize middlewares
function initMiddlewares(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(
        session({
            store: new RedisStore({
                client: redisClient,
                ttl: 86400,
            }),
            secret: process.env.SESSION_SECRET,
            saveUninitialized: true,
            resave: true,
            name: 'sessionId',
            cookie: {
                httpOnly: true,
                domain: 'localhost',
            },
        })
    );
}

// Initialize controllers
function initControllers(app) {
    app.all('/', (req, res) => {
        res.send('Works!');
    });

    // app.use("/users", userRouter);
    // app.use("/urls", urlRouter);
}

// Initialize error handling
function initErrorHandling(app) {
    app.use((err, req, res) => {
        console.log(err);

        res.status(500).send(err.message);
    });
}

module.exports = function webContext(app) {
    initMiddlewares(app);
    initControllers(app);
    initErrorHandling(app);
};
