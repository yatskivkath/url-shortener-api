// webContext.js
// App web context configuration

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const swaggerUI = require('swagger-ui-express');
const path = require('path');

const swaggerSpec = require('./swagger.js');
const redisClient = require('./src/redis/redisClient.js');

const userRouter = require('./src/routes/userRouter.js');
const urlRouter = require('./src/routes/urlRouter.js');
const codeRouter = require('./src/routes/codeRouter.js');
const pagesRouter = require('./src/routes/pagesRouter.js');
const authRouter = require('./src/routes/authRouter.js');
const rateLimitRouter = require('./src/routes/rateLimitRouter.js');

// Initialize middlewares
function initMiddlewares(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.set('trust proxy', true);

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
    app.use('/api/users', userRouter);
    app.use('/api/urls', urlRouter);
    app.use('/redirect', codeRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/rateLimit', rateLimitRouter);
    app.use('/', pagesRouter);
}

function initDocs(app) {
    app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

function initPages(app) {
    app.set('views', path.join(__dirname, 'src/pages'));
    app.set('view engine', 'ejs');
}

function initErrorHandling(app) {
    app.use((error, req, res, next) => {
        console.error(error);
        res.status(error.statusCode).json({ error: error.message }).end();
    });
}

function initStaticAssets(app) {
    app.use(express.static(path.join(__dirname, 'public')));
}

module.exports = function webContext(app) {
    initStaticAssets(app);
    initMiddlewares(app);
    initControllers(app);
    initDocs(app);
    initPages(app);
    initErrorHandling(app);
};
