const {
    NotFound,
    Forbidden,
    BadRequest,
} = require('../../../src/errors/errors.js');
const { faker, ur } = require('@faker-js/faker');

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

const urlService = require('../../../src/services/urlService.js');
const codeService = require('../../../src/services/codeService.js');

describe('Code Service getUrlToRedirect function', () => {
    const url = require('../../../src/models/url.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return an original url to redirect by provided code', async () => {
        const CODE = faker.string.alphanumeric(5);
        const REDIRECT_URL = faker.internet.url();

        url.$queueResult(
            url.build({
                code: CODE,
                url: REDIRECT_URL,
                enabled: true,
                active: true,
            })
        );

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBe(REDIRECT_URL);
    });

    it('should return NULL if code was not found', async () => {
        const CODE = faker.string.alphanumeric(5);

        url.$queueResult(null);

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBeNull();
    });

    it('should return NULL if code was not provided', async () => {
        const CODE = undefined;

        url.$queueResult(null);

        await expect(codeService.getUrlToRedirect(CODE)).rejects.toThrow(
            BadRequest
        );
    });

    it('should return NULL if code is empty string', async () => {
        const CODE = '';

        await expect(codeService.getUrlToRedirect(CODE)).rejects.toThrow(
            BadRequest
        );
    });

    it('should return NULL if url is not enabled', async () => {
        const CODE = faker.string.alphanumeric(5);

        url.$queueResult(
            url.build({
                code: CODE,
                enabled: false,
                active: true,
            })
        );

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBeNull();
    });

    it('should return NULL if url is expired', async () => {
        const CODE = faker.string.alphanumeric(5);

        url.$queueResult(
            url.build({
                code: CODE,
                enabled: true,
                active: false,
            })
        );

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBeNull();
    });

    it('should return NULL if url is of ONE-TIME type and has been already visited', async () => {
        const URL = {
            code: 'test',
            redirectUrl: 'https://google.com',
            name: 'Google',
            type: 'OT',
        };

        url.$queueResult(
            url.build({
                code: URL.code,
                url: URL.redirectUrl,
                name: URL.name,
                type: URL.type,
                visits: 1,
                enabled: true,
                active: false,
            })
        );

        urlService.visitUrl(URL.code);

        const result = await codeService.getUrlToRedirect(URL.code);
        expect(result).toBeNull();
    });
});
