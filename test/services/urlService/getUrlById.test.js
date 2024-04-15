const { NotFound, Forbidden } = require('../../../src/errors/errors.js');

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

describe('Url Service getUrlById function', () => {
    const urlService = require('../../../src/services/urlService.js');

    const url = require('../../../src/models/url.js');
    const user = require('../../../src/models/user.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should throw an error if url is not found', async () => {
        const ID = '83d29972-9543-418f-90e2-270bf9cda48b';
        const USER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';

        user.$queueResult(user.build({ id: USER_ID }));
        url.$queueResult(null);

        await expect(urlService.getUrlById(ID, USER_ID)).rejects.toThrow(
            NotFound
        );
    });

    it('should return an url by provided id when user owns this url', async () => {
        const ID = '4145686d-4ec0-44e7-a711-36fbf3dd3af6';
        const OWNER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';

        url.$queueResult(url.build({ id: ID, userId: OWNER_ID }));

        const result = await urlService.getUrlById(ID, OWNER_ID);

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

    it('should return an url by provided id when user is an admin', async () => {
        const ID = '4145686d-4ec0-44e7-a711-36fbf3dd3af6';
        const ADMIN_ID = 'c9bb5609-4588-4d7d-bb18-c3e430ac7377';

        url.$queueResult(url.build({ id: ID }));
        user.$queueResult(user.build({ id: ADMIN_ID, role: 'admin' }));

        const result = await urlService.getUrlById(ID, ADMIN_ID);

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

    it('should throw an error if user does not own this url and is not an admin', async () => {
        const ID = '701db3f5-59f1-443c-beeb-50ff31c5b14f';
        const USER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';
        const ANOTHER_USER_ID = 'c9bb5609-4588-4d7d-bb18-c3e430ac7377';

        url.$queueResult(url.build({ id: ID, userId: ANOTHER_USER_ID }));
        user.$queueResult(user.build({ id: USER_ID, role: 'user' }));

        await expect(urlService.getUrlById(ID, USER_ID)).rejects.toThrow(
            Forbidden
        );
    });

    it('should throw an error if invalid value was passed to id', async () => {
        const INVALID_IDS = [null, undefined, 0, false, NaN, 'DUMMY'];
        const USER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';

        INVALID_IDS.forEach(async (id) => {
            url.$queueResult(null);
            user.$queueResult(user.build({ id: USER_ID }));

            await expect(urlService.getUrlById(id, USER_ID)).rejects.toThrow(
                NotFound
            );
        });
    });

    it('should throw an error if invalid value was passed to userId', async () => {
        const ID = '701db3f5-59f1-443c-beeb-50ff31c5b14f';
        const INVALID_USER_IDS = [null, undefined, 0, false, NaN, 'dummy'];

        INVALID_USER_IDS.forEach(async (userId) => {
            url.$queueResult(url.build({ id: ID }));
            user.$queueResult(null);

            await expect(urlService.getUrlById(ID, userId)).rejects.toThrow(
                NotFound
            );
        });
    });
});
