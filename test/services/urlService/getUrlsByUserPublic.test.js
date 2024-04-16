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

describe('Url Service getUrlsByUserPublic function', () => {
    const urlService = require('../../../src/services/urlService.js');
    const url = require('../../../src/models/url.js');

    const URL = require('../../__mocks__/url.json');
    const USER = require('../../__mocks__/user.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return all urls by user id', async () => {
        const USER_ID = USER.id;

        url.$queueResult([url.build()]);

        const result = await urlService.getUrlsByUserPublic(USER_ID);

        expect(result).toEqual([URL]);
    });

    it('should return an empty array if no urls are found', async () => {
        const USER_ID = faker.string.uuid();

        url.$queueResult(null);

        const result = await urlService.getUrlsByUserPublic(USER_ID);

        expect(result).toEqual([]);
    });

    it('should return an empty array if invalid value was passed', async () => {
        const INVALID_USER_IDS = [null, undefined, 0, false, NaN, 'dummy'];

        INVALID_USER_IDS.forEach(async (id) => {
            url.$queueResult(null);
            const result = await urlService.getUrlsByUserPublic(id);
            expect(result).toEqual([]);
        });
    });
});
