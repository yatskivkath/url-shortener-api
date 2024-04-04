// userController.js
// Implementation of the User controller

const userService = require('../services/userService.js');

async function createUser(req, res) {
    const { email, password, first_name, last_name } = req.body;

    try {
        const newUser = await userService.createUser({
            email,
            password,
            first_name,
            last_name,
        });

        res.status(201).json(newUser);
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
