const { NotFound } = require('../../../src/errors/errors.js');

jest.mock('../../../src/models/user.js', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();

    return dbMock.define('user', {
        id: '3b365a11-97a3-4d44-8137-b944cade14da',
        first_name: 'Kateyna',
        last_name: 'Yatskiv',
        email: 'kath@mail.com',
        password:
            '$2b$10$M4MkWr595pnNyfA.vS6OSOOMeMAfUTGjnzMf.zg5QIAA9rCkkJBdi',
        createdAt: '2024-04-06T10:33:13.050Z',
        updatedAt: '2024-04-06T10:33:13.050Z',
        role: 'user',
    });
});

jest.mock('../../../src/models/url.js', () => {
    const SequelizeMock = require('sequelize-mock');
    const dbMock = new SequelizeMock();

    return dbMock.define('url', {
        typeParsed: 'Permanent',
        active: true,
        shortUrl: 'http://localhost:3001/redirect/knzqR',
        id: '4145686d-4ec0-44e7-a711-36fbf3dd3af6',
        code: 'knzqR',
        url: 'https://google.com',
        name: 'test',
        visits: 0,
        userId: '3b365a11-97a3-4d44-8137-b944cade14da',
        expirationdDate: null,
        type: 'P',
        enabled: true,
        createdAt: '2024-04-14T17:44:27.951Z',
        updatedAt: '2024-04-14T17:44:27.951Z',
    });
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
    const user = require('../../../src/models/user.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return the url by code', async () => {
        const CODE = 'knzqR';

        url.$queueResult(url.build({ code: CODE }));

        const result = await urlService.getUrlByCodePublic(CODE);

        expect(result).toEqual({
            typeParsed: 'Permanent',
            active: true,
            shortUrl: 'http://localhost:3001/redirect/knzqR',
            id: '4145686d-4ec0-44e7-a711-36fbf3dd3af6',
            code: 'knzqR',
            url: 'https://google.com',
            name: 'test',
            visits: 0,
            userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            expirationdDate: null,
            type: 'P',
            enabled: true,
            createdAt: '2024-04-14T17:44:27.951Z',
            updatedAt: '2024-04-14T17:44:27.951Z',
        });
    });

    it('should throw an error if url is not found', async () => {
        const CODE = 'dummy';

        url.$queueResult(null);

        await expect(urlService.getUrlByCodePublic(CODE)).rejects.toThrow(
            NotFound
        );
    });

    it('should throe an error if invalid value was passed', async () => {
        const INVALID_CODES = [null, undefined, 0, false, NaN, ''];

        INVALID_CODES.forEach(async (code) => {
            url.$queueResult(null);

            await expect(urlService.getUrlByCodePublic(code)).rejects.toThrow(
                NotFound
            );
        });
    });
});
