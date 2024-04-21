// userSchems.js
// Joi Schema for User

const Joi = require('joi');
const { USER_ROLES } = require('../constants/databaseConstants.js');

const userSchemaCreate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
});

const userSchemaUpdate = Joi.object({
    id: Joi.string().uuid().required(),
    role: Joi.string().valid(...Object.values(USER_ROLES)),
});

module.exports = {
    userSchemaCreate,
    userSchemaUpdate,
};
