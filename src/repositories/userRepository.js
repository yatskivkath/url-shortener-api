// userRepository.js
// Implementation of the User repository

const models = require('../models/index.js');

async function saveUser(user) {
    const newUser = await models.user.create({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: user.password,
    });

    return newUser;
}

async function findUserById(id, scope = 'defaultScope') {
    const user = await models.user.scope(scope).findByPk(id);

    return user;
}

async function findUserByEmail(email, scope = 'defaultScope') {
    const user = await models.user.scope(scope).findOne({
        where: {
            email,
        },
    });

    return user;
}

async function getAllUsers(scope = 'defaultScope') {
    const users = await models.user.scope(scope).findAll();

    return users ?? [];
}

module.exports = {
    saveUser,
    findUserById,
    findUserByEmail,
    getAllUsers,
};
