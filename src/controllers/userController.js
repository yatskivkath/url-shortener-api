// userController.js
// Implementation of the User controller

const userService = require('../services/userService.js');
const userSchema = require('../validators/userSchema.js');

async function createUser(req, res) {
    try {
        const data = req.body;

        userSchema.validate(data);

        const newUser = await userService.createUser(data);

        res.status(201).json({
            status: 'success',
            data: newUser,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await userService.getUsersPublic();

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createUser,
    getAllUsers,
};
