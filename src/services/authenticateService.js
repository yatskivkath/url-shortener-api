// authenticateService.js
// Implementation of the Authenticate service

const bcrypt = require('bcrypt');

async function hashPassword(password) {
    if (!password || typeof password !== 'string') {
        throw new Error('Invalid value was passed to password');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
}

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
