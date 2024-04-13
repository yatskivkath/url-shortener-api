// userService.js
// Implementation of the User service

const userRepository = require('../repositories/userRepository.js');
const authenticationService = require('./authenticationService.js');
const scopes = require('../constants/scopes.js');

async function createUser(user) {
    const { firstName, lastName, email, password } = user;
    const hashedPassword = await authenticationService.hashPassword(password);

    const newUser = await userRepository.saveUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    return newUser;
}

async function getUserByEmail(email) {
    if (typeof email !== 'string') {
        throw new Error('Invalid value was passed to email');
    }

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new Error('User was not found');
    }

    return user;
}

async function getUsersPublic() {
    const users = await userRepository.getAllUsers(scopes.user.public);

    return users;
}

async function checkPassword(email, password) {
    try {
        const user = await getUserByEmail(email);
        const isMatch = await authenticationService.comparePasswords(
            password,
            user.password
        );

        return isMatch;
    } catch (error) {
        switch (error.message) {
            case 'User was not found':
                return false;
            default:
                throw error;
        }
    }
}

async function getUserById(userId) {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new Error('User was not found');
    }

    return user;
}

module.exports = {
    createUser,
    getUserByEmail,
    getUsersPublic,
    checkPassword,
    getUserById,
};
