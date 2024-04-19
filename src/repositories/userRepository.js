// userRepository.js
// Implementation of the User repository

const models = require('../models/index.js');

async function saveUser(user) {
    const newUser = await models.user.create({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
    });

    return newUser?.toJSON();
}

async function findUserById(id, scope = 'defaultScope') {
    const user = await models.user.scope(scope).findOne({
        where: {
            id,
        },
    });

    return user?.toJSON();
}

async function findUserByEmail(email, scope = 'defaultScope') {
    const user = await models.user.scope(scope).findOne({
        where: {
            email,
        },
    });

    return user?.toJSON();
}

async function getAllUsers(scope = 'defaultScope') {
    const users = await models.user.scope(scope).findAll();

    return users?.map((u) => u.toJSON()) ?? [];
}

async function deleteUser(id) {
    await models.user.destroy({
        where: {
            id,
        },
    });
}

module.exports = {
    saveUser,
    findUserById,
    findUserByEmail,
    getAllUsers,
    deleteUser,
};
