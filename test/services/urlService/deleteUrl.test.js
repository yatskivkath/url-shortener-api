const { NotFound, Forbidden } = require('../../../src/errors/errors.js');
const { faker } = require('@faker-js/faker');

jest.mock('../../../src/models/user.js', () => {
    const USER = require('../../__mocks__/user.json');
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();

    return dbMock.define('user', USER);
});

jest.mock('../../../src/models/url.js', () => {
    const URL = require('../../__mocks__/url.json');
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();

    return dbMock.define('url', URL);
});

jest.mock('../../../src/models/index.js', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();

    const url = require('../../../src/models/url.js');
    const user = require('../../../src/models/user.js');

    return {
        url,
        user,
        sequelize: dbMock,
        Sequelize: SequelizeMock,
    };
});

describe('Url Service deleteUrl function', () => {
    const urlService = require('../../../src/services/urlService.js');

    const url = require('../../../src/models/url.js');
    const user = require('../../../src/models/user.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should throw an error if url is not found', async () => {
        const URL_ID = faker.string.uuid();
        const USER_ID = faker.string.uuid();

        url.$queueResult(null);

        await expect(urlService.deleteUrl(URL_ID, USER_ID)).rejects.toThrow(
            new NotFound('Url was not found')
        );
    });

    it('should throw an error if user is not found', async () => {
        const URL_ID = faker.string.uuid();
        const USER_ID = faker.string.uuid();

        user.$queueResult(null);

        await expect(urlService.deleteUrl(URL_ID, USER_ID)).rejects.toThrow(
            new NotFound('User was not found')
        );
    });

    it('should throw an error if user is not owner of the url and not an admin', async () => {
        const URL_ID = faker.string.uuid();
        const USER_ID = faker.string.uuid();
        const ANOTHER_USER_ID = faker.string.uuid();

        url.$queueResult(url.build({ userId: ANOTHER_USER_ID }));
        user.$queueResult(user.build({ id: USER_ID, role: 'user' }));

        await expect(urlService.deleteUrl(URL_ID, USER_ID)).rejects.toThrow(
            Forbidden
        );
    });

    it('should delete the url if user is owner of the url', async () => {
        const URL_ID = faker.string.uuid();
        const USER_ID = faker.string.uuid();

        url.$queueResult(url.build({ userId: USER_ID }));
        user.$queueResult(user.build({ id: USER_ID }));

        await expect(
            urlService.deleteUrl(URL_ID, USER_ID)
        ).resolves.toBeUndefined();
    });

    it('should delete the url if user is admin', async () => {
        const URL_ID = faker.string.uuid();
        const USER_ID = faker.string.uuid();
        const ANOTHER_USER_ID = faker.string.uuid();

        url.$queueResult(url.build({ userId: ANOTHER_USER_ID }));
        user.$queueResult(user.build({ id: USER_ID, role: 'admin' }));

        await expect(
            urlService.deleteUrl(URL_ID, USER_ID)
        ).resolves.toBeUndefined();
    });
});
