const { faker } = require('@faker-js/faker');
const { ValidationError } = require('../../../src/errors/errors.js');

jest.mock('../../../src/models/user.js', () => {
    const USER = require('../../__mocks__/user.json');
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();

    return dbMock.define('user', USER);
});

jest.mock('../../../src/models/index.js', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();
    const user = require('../../../src/models/user.js');

    return {
        user,
        sequelize: dbMock,
        Sequelize: SequelizeMock,
    };
});

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

describe('User Service getUserByEmail function', () => {
    const userService = require('../../../src/services/userService.js');
    const bcrypt = require('bcrypt');

    const user = require('../../../src/models/user.js');
    const USER = require('../../__mocks__/user.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return true if password is correct', async () => {
        const PASSWORD = USER.password;
        const EMAIL = USER.email;

        user.$queueResult(user.build({ password: bcrypt.hash(PASSWORD) }));

        const result = await userService.checkPassword(EMAIL, PASSWORD);

        expect(result).toBeTruthy();
    });

    it('should return false if password is incorrect', async () => {
        const INCORRECT_PASSWORD = faker.internet.password();
        const EMAIL = USER.email;
        const PASSWORD = USER.password;

        user.$queueResult(user.build({ password: bcrypt.hash(PASSWORD) }));

        const result = await userService.checkPassword(
            EMAIL,
            INCORRECT_PASSWORD
        );

        expect(result).toBeFalsy();
    });

    it('should throw an error if wrong email was passed to email', async () => {
        const INVALID_EMAILS = [null, undefined, 123, [], {}];

        INVALID_EMAILS.forEach(async (email) => {
            const PASSWORD = USER.password;

            await expect(
                userService.checkPassword(email, PASSWORD)
            ).rejects.toThrow(ValidationError);
        });
    });
});
