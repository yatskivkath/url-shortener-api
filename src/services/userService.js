// userService.js
// Implementation of the User service

const userRepository = require('../repositories/userRepository.js');
const authenticateService = require('./authenticateService.js');
const scopes = require('../constants/scopes.js');

async function createUser(user) {
    const { firstName, lastName, email, password } = user;
    const hashedPassword = await authenticateService.hashPassword(password);

    const newUser = await userRepository.saveUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    return newUser;
}

async function getUserByEmail(email) {
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
    const user = await getUserByEmail(email);

    if (!user) {
        return false;
    }

    const isMatch = await authenticateService.comparePasswords(
        password,
        user.password
    );

    return isMatch;
}

module.exports = {
    createUser,
    getUserByEmail,
    getUsersPublic,
    checkPassword,
};
