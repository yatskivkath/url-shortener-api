// urlSchema.js
// Joi Schema for URL

const Joi = require('joi');

const { URL_TYPES } = require('../constants/databaseConstants.js');

const urlSchemaCreate = Joi.object({
    redirectUrl: Joi.string().uri().required(),
    name: Joi.string().required(),
    code: Joi.string().alphanum().min(5).max(15),
    expirationDate: Joi.date().min('now'),
    type: Joi.string().valid(...Object.values(URL_TYPES)),
    codeLength: Joi.number().integer().min(5).max(15),
})
    .without('code', 'codeLength')
    .with('expirationDate', 'type');

const urlSchemaUpdate = Joi.object({
    name: Joi.string(),
    expirationDate: Joi.date().min('now'),
    type: Joi.string().valid(...Object.values(URL_TYPES)),
    enabled: Joi.boolean(),
    code: Joi.string().alphanum().min(5).max(15),
});

const urlSchemaGet = Joi.object({
    code: Joi.string().alphanum().min(5).max(15).required(),
});

const urlSchemaDelete = Joi.object({
    id: Joi.string().required(),
});

module.exports = {
    urlSchemaCreate,
    urlSchemaUpdate,
    urlSchemaGet,
    urlSchemaDelete,
};
