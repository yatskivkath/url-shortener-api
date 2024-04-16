const { NotFound } = require('../../../src/errors/errors.js');
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

describe('Url Service getUrlByCodePublic function', () => {
    const urlService = require('../../../src/services/urlService.js');

    const url = require('../../../src/models/url.js');

    const URL = require('../../__mocks__/url.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return the url by code', async () => {
        const CODE = URL.code;

        url.$queueResult(url.build({ code: CODE }));

        const result = await urlService.getUrlByCodePublic(CODE);

        expect(result).toEqual(URL);
    });

    it('should throw an error if url is not found', async () => {
        const CODE = faker.string.alphanumeric(5);

        url.$queueResult(null);

        await expect(urlService.getUrlByCodePublic(CODE)).rejects.toThrow(
            NotFound
        );
    });

    it('should throw an error if invalid value was passed', async () => {
        const INVALID_CODES = [null, undefined, 0, false, NaN, ''];

        INVALID_CODES.forEach(async (code) => {
            url.$queueResult(null);

            await expect(urlService.getUrlByCodePublic(code)).rejects.toThrow(
                NotFound
            );
        });
    });
});
