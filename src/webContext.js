// webContext.js
// App web context configuration

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

const redisClient = require('./redis/redisClient.js');

const userRouter = require('./routes/userRouter.js');
const urlRouter = require('./routes/urlRouter.js');
const codeRouter = require('./routes/codeRouter.js');
const pagesRouter = require('./routes/pagesRouter.js');
const authRouter = require('./routes/authRouter.js');

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
    app.all('/', (req, res) => {
        res.send('Works!');
    });

    app.use('/api/users', userRouter);
    app.use('/api/urls', urlRouter);
    app.use('/redirect', codeRouter);
    app.use('/', pagesRouter);
    app.use('/api/auth', authRouter);
}

function initDocs(app) {
    app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

function initPages(app) {
    app.set('views', 'src/pages');
    app.set('view engine', 'ejs');
}

function initErrorHandling(app) {
    app.use((error, req, res, next) => {
        console.error(error);
        res.status(500).json({ error: error.message });
    });
}

module.exports = function webContext(app) {
    initMiddlewares(app);
    initControllers(app);
    initDocs(app);
    initPages(app);
    initErrorHandling(app);
};
