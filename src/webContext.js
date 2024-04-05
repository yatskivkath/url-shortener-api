// webContext.js
// App web context configuration

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;

const redisClient = require('./redis/redisClient.js');
const userRouter = require('./routes/userRouter.js');
const urlRouter = require('./routes/urlRouter.js');

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

    app.use('/users', userRouter);
    app.use('/urls', urlRouter);
}

module.exports = function webContext(app) {
    initMiddlewares(app);
    initControllers(app);
};
