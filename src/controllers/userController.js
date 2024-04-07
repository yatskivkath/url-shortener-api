// userController.js
// Implementation of the User controller

const userService = require('../services/userService.js');
const userSchema = require('../validators/userSchema.js');

async function createUser(req, res, next) {
    try {
        const data = req.body;

        userSchema.validate(data);

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

module.exports = {
    createUser,
    getAllUsers,
};
