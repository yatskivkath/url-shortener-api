const {
    NotFound,
    BadRequest,
    ValidationError,
} = require('../../../src/errors/errors.js');
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

describe('Url Service createUrl function', () => {
    const urlService = require('../../../src/services/urlService.js');

    const url = require('../../../src/models/url.js');
    const user = require('../../../src/models/user.js');

    const USER = require('../../__mocks__/user.json');
    const URL = require('../../__mocks__/url.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should throw an error if user is not found', async () => {
        const URL = {
            redirectUrl: faker.internet.url(),
            name: faker.lorem.word(),
            type: 'P',
        };
        const USER_ID = faker.string.uuid();

        user.$queueResult(null);

        await expect(urlService.createUrl(URL, USER_ID)).rejects.toThrow(
            new NotFound('User was not found')
        );
    });

    it('should throw an error if either redirectUrl, name or type is not provided', async () => {
        const INVALID_URLS = [
            {
                redirectUrl: URL.redirectUrl,
                name: URL.name,
            },
            {
                redirectUrl: URL.redirectUrl,
                type: URL.type,
            },
            {
                name: URL.name,
                type: URL.type,
            },
        ];

        user.$queueResult(user.build(USER));

        INVALID_URLS.forEach(async (url) => {
            await expect(urlService.createUrl(url, USER.id)).rejects.toThrow(
                BadRequest
            );
        });
    });

    it('should throw an error if expiration date is not provided for temporary urls', async () => {
        const URL_DATA = {
            redirectUrl: faker.internet.url(),
            name: faker.lorem.word(),
            type: 'T',
        };

        user.$queueResult(user.build(USER));

        await expect(urlService.createUrl(URL_DATA, USER.id)).rejects.toThrow(
            ValidationError
        );
    });

    it('should throw an error if expiration date is provided for permanent urls', async () => {
        const URL_DATA = {
            redirectUrl: faker.internet.url(),
            name: faker.lorem.word(),
            type: 'P',
            expirationDate: faker.date.future(),
        };

        user.$queueResult(user.build(USER));

        await expect(urlService.createUrl(URL_DATA, USER.id)).rejects.toThrow(
            ValidationError
        );
    });
});
