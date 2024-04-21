const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'error',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
});

const options =
    process.env.NODE_ENV === 'development' ? { handleExceptions: true } : {};

const console = new winston.transports.Console(options);
logger.clear().add(console);

module.exports = logger;
