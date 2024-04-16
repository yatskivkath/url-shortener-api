const { faker, fa } = require('@faker-js/faker');
const { BadRequest } = require('../../../src/errors/errors.js');

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

describe('User Service createUser function', () => {
    const userService = require('../../../src/services/userService.js');

    const user = require('../../../src/models/user.js');
    const USER = require('../../__mocks__/user.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should create a new user', async () => {
        const USER_DATA = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };

        user.$queueResult(user.build(USER_DATA));

        const result = await userService.createUser(USER_DATA);

        expect(result).toEqual({
            ...USER,
            ...USER_DATA,
            password: `hashed${USER_DATA.password}`,
        });
    });

    test('should throw an error if either firstName or lastName or email or password is not passed', async () => {
        const INVALID_USERS = [
            {
                firstName: USER.firstName,
                lastName: USER.lastName,
                email: USER.email,
            },
            {
                firstName: USER.firstName,
                lastName: USER.lastName,
                password: USER.password,
            },
            {
                firstName: USER.firstName,
                email: USER.email,
                password: USER.password,
            },
            {
                lastName: USER.lastName,
                email: USER.email,
                password: USER.password,
            },
        ];

        INVALID_USERS.forEach(async (user) => {
            await expect(userService.createUser(user)).rejects.toThrow(
                BadRequest
            );
        });
    });
});
