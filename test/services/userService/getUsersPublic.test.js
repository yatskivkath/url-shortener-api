const { faker } = require('@faker-js/faker');

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

describe('User Service getUsersPublic function', () => {
    const userService = require('../../../src/services/userService.js');

    const user = require('../../../src/models/user.js');
    const USER = require('../../__mocks__/user.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return all users', async () => {
        const USER_1 = {
            ...USER,
            id: faker.string.uuid(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
        };
        const USER_2 = {
            ...USER,
            id: faker.string.uuid(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
        };
        const USER_3 = {
            ...USER,
            id: faker.string.uuid(),
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
        };

        user.$queueResult([
            user.build(USER_1),
            user.build(USER_2),
            user.build(USER_3),
        ]);

        const result = await userService.getUsersPublic();

        expect(result).toEqual([USER_1, USER_2, USER_3]);
    });
});
