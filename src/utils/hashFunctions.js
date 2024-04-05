// hashFunctions.js
// Implementation of the hash generation function

const CHARACTERS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const DEFAULT_LENGTH = 5;

const generateHash = (len = DEFAULT_LENGTH) => {
    if (!Number(len)) {
        throw new Error('Please send a correct string length');
    }

    let result = '';
    for (let i = 0; i < len; i++) {
        result += CHARACTERS.charAt(
            Math.floor(Math.random() * CHARACTERS.length)
        );
    }

    return result;
};

module.exports = { generateHash };
