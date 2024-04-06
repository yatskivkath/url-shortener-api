const { generateHash } = require('../../src/utils/hashFunctions.js');

const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

describe('generateHash Util', () => {
    it('should return random string with length provided in arguments', () => {
        const GENERATED_LENGTH = 10;

        const result = generateHash(GENERATED_LENGTH);

        expect(typeof result).toBe('string');
        expect(result).toHaveLength(GENERATED_LENGTH);
    });

    it('should return random string with length when len argument was not provided', () => {
        const GENERATED_LENGTH = 5;

        const result = generateHash();

        expect(typeof result).toBe('string');
        expect(result).toHaveLength(GENERATED_LENGTH);
    });

    it('should return empty string for INVALID length', () => {
        const result = generateHash('STRING');

        expect(typeof result).toBe('string');
        expect(result).toHaveLength(0);
    });

    it('should return random string which consist only of valid characters', () => {
        const result = generateHash();

        for (const char of result) {
            expect(characters.includes(char)).toBeTruthy();
        }
    });
});
