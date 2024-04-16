const { faker } = require('@faker-js/faker');
const { NotFound, ValidationError } = require('../../../src/errors/errors.js');

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

describe('User Service getUsersById function', () => {
    const userService = require('../../../src/services/userService.js');

    const user = require('../../../src/models/user.js');
    const USER = require('../../__mocks__/user.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return a user by id', async () => {
        const USER_ID = faker.string.uuid();

        const USER_1 = {
            ...USER,
            id: USER_ID,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
        };

        user.$queueResult(user.build(USER_1));

        const result = await userService.getUserById(USER_ID);

        expect(result).toEqual(USER_1);
    });

    it('should throw an error if user was not found', async () => {
        const USER_ID = faker.string.uuid();

        user.$queueResult(null);

        await expect(userService.getUserById(USER_ID)).rejects.toThrow(
            NotFound
        );
    });

    it('should throw an error if invalid value was passed to id', async () => {
        const INVALID_IDS = [null, undefined, 0, false, NaN];

        INVALID_IDS.forEach(async (id) => {
            await expect(userService.getUserById(id)).rejects.toThrow(
                ValidationError
            );
        });
    });
});
