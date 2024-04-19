// userController.js
// Implementation of the User controller

const userService = require('../services/userService.js');
const userSchema = require('../validators/userSchema.js');
const { ValidationError, BadRequest } = require('../errors/errors.js');

async function createUser(req, res, next) {
    try {
        const data = req.body;

        const { error } = userSchema.validate(data);
        if (error) {
            throw new ValidationError(error.message);
        }

        const newUser = await userService.createUser(data);

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

        res.status(204).end();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
};
