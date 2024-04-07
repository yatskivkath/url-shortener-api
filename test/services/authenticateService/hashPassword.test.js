jest.mock('bcrypt', () => {
    return {
        hash: jest.fn().mockImplementation((password) => {
            return `hashed${password}`;
        }),
        compare: jest.fn().mockImplementation((password, hashedPassword) => {
            return `hashed${password}` === hashedPassword;
        }),
    };
});

describe('Authenticate Service hashPassword function', () => {
    const authenticateService = require('../../../src/services/authenticateService.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return a hashed password', async () => {
        const PASSWORD = 'test1';

        const result = await authenticateService.hashPassword(PASSWORD);

        expect(result).toEqual('hashedtest1');
    });

    it('should return true for a correct password', async () => {
        const PASSWORD = 'test1';
        const HASHED_PASSWORD = 'hashedtest1';
        const isMatch = await authenticateService.comparePasswords(
            PASSWORD,
            HASHED_PASSWORD
        );

        expect(isMatch).toBeTruthy();
    });

    it('should return true for an incorrect password', async () => {
        const PASSWORD = 'test1';
        const HASHED_PASSWORD = 'hashedtest1';
        const isMatch = await authenticateService.comparePasswords(
            PASSWORD,
            HASHED_PASSWORD
        );

        expect(isMatch).toBeTruthy();
    });

    it('should throw an error if invalid value was passed to password', async () => {
        const INVALID_PASSWORDS = [null, undefined, 0, false, NaN];

        INVALID_PASSWORDS.forEach(async (password) => {
            await expect(
                authenticateService.hashPassword(password)
            ).rejects.toThrow('Invalid value was passed to password');
        });
    });
});