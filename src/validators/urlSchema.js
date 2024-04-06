// urlSchema.js
// Joi Schema for URL

const Joi = require('joi');

const { URL_TYPES } = require('../constants/databaseConstants.js');

const urlSchema = Joi.object({
    redirectUrl: Joi.string().uri().required(),
    name: Joi.string().required(),
    code: Joi.string().alphanum().min(5).max(15),
    expire: Joi.date().min('now'),
    type: Joi.string().valid(...Object.values(URL_TYPES)),
    codeLength: Joi.number().integer().min(5).max(15),
});

module.exports = urlSchema;
