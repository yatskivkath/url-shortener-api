// userController.js
// Implementation of the User controller

const userService = require('../services/userService.js');
const {
    userSchemaCreate,
    userSchemaUpdate,
} = require('../validators/userSchema.js');
const { ValidationError, BadRequest } = require('../errors/errors.js');
const logger = require('../../logger.js');

async function createUser(req, res, next) {
    try {
        const data = req.body;

        const { error } = userSchemaCreate.validate(data);
        if (error) {
            throw new ValidationError(error.message);
        }

        const newUser = await userService.createUser(data);

        logger.log({
            level: 'info',
            message: 'User created',
            params: {
                user: newUser,
            },
        });

        res.status(201).json({
            status: 'success',
            data: newUser,
        });
    } catch (error) {
        next(error);
    }
}

async function getAllUsers(req, res, next) {
    try {
        const users = await userService.getUsersPublic();

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const userId = req.session.userId;
        const id = req.params.id;

        if (userId === id) {
            throw new BadRequest('You cannot delete yourself');
        }

        await userService.deleteUser(id, userId);

        logger.log({
            level: 'info',
            message: 'User deleted',
            params: {
                id,
            },
        });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const userId = req.session.userId;
        const id = req.params.id;
        const data = req.body;

        data.id = id;

        const { error } = userSchemaUpdate.validate(data);
        if (error) {
            throw new ValidationError(error.message);
        }

        await userService.updateUser(userId, data);

        logger.log({
            level: 'info',
            message: 'User updated',
            params: {
                id,
                data,
            },
        });

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
    updateUser,
};
