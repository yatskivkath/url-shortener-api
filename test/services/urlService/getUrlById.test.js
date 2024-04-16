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

describe('Url Service getUrlById function', () => {
    const urlService = require('../../../src/services/urlService.js');

    const url = require('../../../src/models/url.js');
    const user = require('../../../src/models/user.js');

    const USER = require('../../__mocks__/user.json');
    const URL = require('../../__mocks__/url.json');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should throw an error if url is not found', async () => {
        const ID = faker.string.uuid();
        const USER_ID = USER.id;

        user.$queueResult(user.build({ id: USER_ID }));
        url.$queueResult(null);

        await expect(urlService.getUrlById(ID, USER_ID)).rejects.toThrow(
            NotFound
        );
    });

    it('should return an url by provided id when user owns this url', async () => {
        const ID = URL.id;
        const OWNER_ID = URL.userId;

        url.$queueResult(url.build({ id: ID, userId: OWNER_ID }));

        const result = await urlService.getUrlById(ID, OWNER_ID);

        expect(result).toEqual(URL);
    });

    it('should return an url by provided id when user is an admin', async () => {
        const ID = URL.id;
        const ADMIN_ID = faker.string.uuid();

        url.$queueResult(url.build({ id: ID }));
        user.$queueResult(user.build({ id: ADMIN_ID, role: 'admin' }));

        const result = await urlService.getUrlById(ID, ADMIN_ID);

        expect(result).toEqual(URL);
    });

    it('should throw an error if user does not own this url and is not an admin', async () => {
        const ID = URL.id;
        const USER_ID = USER.id;
        const ANOTHER_USER_ID = faker.string.uuid();

        url.$queueResult(url.build({ id: ID, userId: ANOTHER_USER_ID }));
        user.$queueResult(user.build({ id: USER_ID, role: 'user' }));

        await expect(urlService.getUrlById(ID, USER_ID)).rejects.toThrow(
            Forbidden
        );
    });

    it('should throw an error if invalid value was passed to id', async () => {
        const INVALID_IDS = [null, undefined, 0, false, NaN, 'DUMMY'];
        const USER_ID = USER.id;

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
