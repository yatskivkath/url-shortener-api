// authenticationService.js
// Implementation of the Authenticate service

const bcrypt = require('bcrypt');

/**
 * Hash a password
 * @param {string} password password
 * @returns {Promise<string>} hashed password
 * @throws {Error} if an invalid value was passed to password
 */
async function hashPassword(password) {
    if (!password || typeof password !== 'string') {
        throw new Error('Invalid value was passed to password');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
}

/**
 * Compare a password with a hashed password
 * @param {string} password password
 * @param {string} hashedPassword hashed password
 * @returns {Promise<boolean>} true if the passwords match, false otherwise
 * @throws {Error} if an invalid value was passed to password
 */
async function comparePasswords(password, hashedPassword) {
    if (
        !password ||
        typeof password !== 'string' ||
        !hashedPassword ||
        typeof hashedPassword !== 'string'
    ) {
        throw new Error('Invalid value was passed to password');
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch;
}

module.exports = {
    hashPassword,
    comparePasswords,
};
