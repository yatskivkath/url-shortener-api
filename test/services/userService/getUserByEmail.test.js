const { faker } = require('@faker-js/faker');
const {
    ValidationError,
    BadRequest,
} = require('../../../src/errors/errors.js');

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

describe('User Service getUserByEmail function', () => {
    const userService = require('../../../src/services/userService.js');

    const user = require('../../../src/models/user.js');
    const USER = require('../../__mocks__/user.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return a user by provided email', async () => {
        const EMAIL = USER.email;

        user.$queueResult(user.build());

        const result = await userService.getUserByEmail(EMAIL);

        expect(result).toEqual(USER);
    });

    test('should throw an error if user is not found', async () => {
        const EMAIL = faker.internet.email();

        user.$queueResult(null);

        await expect(userService.getUserByEmail(EMAIL)).rejects.toThrow(
            BadRequest
        );
    });

    test('should throw an error if invalid value was passed to email', async () => {
        const INVALID_EMAILS = [null, undefined, 0, false, NaN];

        INVALID_EMAILS.forEach(async (email) => {
            await expect(userService.getUserByEmail(email)).rejects.toThrow(
                ValidationError
            );
        });
    });
});
