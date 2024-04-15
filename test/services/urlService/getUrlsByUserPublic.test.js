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

describe('Url Service getUrlsByUserPublic function', () => {
    const urlService = require('../../../src/services/urlService.js');
    const url = require('../../../src/models/url.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return all urls by user id', async () => {
        const USER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';

        const result = await urlService.getUrlsByUserPublic(USER_ID);

        expect(result).toEqual([
            {
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
            },
        ]);
    });

    it('should return an empty array if no urls are found', async () => {
        const USER_ID = '28143c34-64cb-444f-9e15-abaf6916e156';

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
