// userService.js
// Implementation of the User service

const userRepository = require('../repositories/userRepository.js');
const authenticationService = require('./authenticationService.js');
const scopes = require('../constants/scopes.js');
const {
    ValidationError,
    BadRequest,
    NotFound,
} = require('../errors/errors.js');
const permissionsService = require('./permissionsService.js');
const { actions, subjects } = require('../constants/permissionsConstants.js');

/**
 * Create a new user
 * @param {Object} user user object
 * @param {string} user.firstName user first name
 * @param {string} user.lastName user last name
 * @param {string} user.email user email
 * @param {string} user.password user password
 * @returns {Promise<Object>} created user
 */
async function createUser(user) {
    const { firstName, lastName, email, password } = user;

    if (!firstName || !lastName || !email || !password) {
        throw new BadRequest();
    }

    const hashedPassword = await authenticationService.hashPassword(password);

    const newUser = await userRepository.saveUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    return newUser;
}

/**
 * Get a user by email
 * @param {string} email user email
 * @returns {Promise<Object>} user
 * @throws {Error} if user was not found
 */
async function getUserByEmail(email) {
    if (typeof email !== 'string') {
        throw new ValidationError();
    }

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new BadRequest('User not found');
    }

    return user;
}

/**
 * Get all users with public scope
 * @returns {Promise<Array>} users
 */
async function getUsersPublic() {
    const users = await userRepository.getAllUsers(scopes.user.public);

    return users;
}

/**
 * Check if the password is correct
 * @param {string} email user email
 * @param {string} password user password
 * @returns {Promise<boolean>} is password correct
 */
async function checkPassword(email, password) {
    try {
        const user = await getUserByEmail(email);
        const isMatch = await authenticationService.comparePasswords(
            password,
            user.password
        );

        return isMatch;
    } catch (error) {
        switch (true) {
            case error instanceof BadRequest:
                return false;
            default:
                throw error;
        }
    }
}

/**
 * Get a user by id
 * @param {uuid} userId user id
 * @returns {Promise<Object>} user
 * @throws {Error} if user was not found
 */
async function getUserById(userId) {
    if (typeof userId !== 'string') {
        throw new ValidationError();
    }

    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new NotFound('User was not found');
    }

    return user;
}

/**
 * Delete a user
 * @param {uuid} id deleted user id
 * @param {uuid} userId logged in user id
 */
async function deleteUser(id, userId) {
    const deletedUser = await getUserById(id);
    const loggedInUser = await getUserById(userId);

    permissionsService.checkPermissions(
        loggedInUser,
        deletedUser,
        actions.DELETE,
        subjects.USER
    );

    await userRepository.deleteUser(id);
}

module.exports = {
    createUser,
    getUserByEmail,
    getUsersPublic,
    checkPassword,
    getUserById,
    deleteUser,
};
