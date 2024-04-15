const { NotFound, Forbidden } = require('../../../src/errors/errors.js');

jest.mock('../../../src/repositories/userRepository.js', () => {
    const users = [
        {
            id: 'c9bb5609-4588-4d7d-bb18-c3e430ac7377',
            email: 'test1@mail.com',
            password: 'hashedtest1',
            first_name: 'John',
            last_name: 'Doe',
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
            role: 'admin',
        },
        {
            id: '3b365a11-97a3-4d44-8137-b944cade14da',
            email: 'test2@mail.com',
            password: 'hashedtest2',
            first_name: 'Jane',
            last_name: 'Doe',
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
            role: 'user',
        },
    ];
    return {
        findUserById: jest.fn().mockImplementation((id) => {
            return users.find((user) => user.id === id);
        }),
    };
});

jest.mock('../../../src/repositories/urlRepository.js', () => {
    const urls = [
        {
            typeParsed: 'Permanent',
            active: true,
            shortUrl: 'http://localhost:3001/redirect/tlwnd',
            userId: 'c9bb5609-4588-4d7d-bb18-c3e430ac7377',
            //userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            id: '701db3f5-59f1-443c-beeb-50ff31c5b14f',
            url: 'https://tailwindcss.com/',
            name: 'Tailwind',
            code: 'tlwnd',
            visits: 2,
            type: 'P',
            enabled: false,
            expirationdDate: null,
        },
        {
            typeParsed: 'Permanent',
            active: true,
            shortUrl: 'http://localhost:3001/redirect/QB1jkaqlRt2ViX1',
            id: 'ce63f4d7-bba3-41b0-8c4b-d54367a2348e',
            //userId: 'c9bb5609-4588-4d7d-bb18-c3e430ac7377',
            userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio',
            name: 'Web',
            code: 'QB1jkaqlRt2ViX1',
            visits: 2,
            type: 'P',
            enabled: true,
            expirationdDate: null,
        },
    ];

    return {
        getUrl: jest.fn().mockImplementation((id) => {
            return urls.find((url) => url.id === id);
        }),
    };
});

describe('Url Service getUrlById function', () => {
    const urlService = require('../../../src/services/urlService.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should throw an error if url is not found', async () => {
        const ID = '83d29972-9543-418f-90e2-270bf9cda48b';
        const USER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';

        await expect(urlService.getUrlById(ID, USER_ID)).rejects.toThrow(
            NotFound
        );
    });

    it('should return an url by provided id when user owns this url', async () => {
        const ID = 'ce63f4d7-bba3-41b0-8c4b-d54367a2348e';
        const OWNER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';

        const result = await urlService.getUrlById(ID, OWNER_ID);

        expect(result).toEqual({
            typeParsed: 'Permanent',
            active: true,
            shortUrl: 'http://localhost:3001/redirect/QB1jkaqlRt2ViX1',
            id: 'ce63f4d7-bba3-41b0-8c4b-d54367a2348e',
            userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio',
            name: 'Web',
            code: 'QB1jkaqlRt2ViX1',
            visits: 2,
            type: 'P',
            enabled: true,
            expirationdDate: null,
        });
    });

    it('should return an url by provided id when user is an admin', async () => {
        const ID = 'ce63f4d7-bba3-41b0-8c4b-d54367a2348e';
        const ADMIN_ID = 'c9bb5609-4588-4d7d-bb18-c3e430ac7377';

        const result = await urlService.getUrlById(ID, ADMIN_ID);

        expect(result).toEqual({
            typeParsed: 'Permanent',
            active: true,
            shortUrl: 'http://localhost:3001/redirect/QB1jkaqlRt2ViX1',
            id: 'ce63f4d7-bba3-41b0-8c4b-d54367a2348e',
            userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio',
            name: 'Web',
            code: 'QB1jkaqlRt2ViX1',
            visits: 2,
            type: 'P',
            enabled: true,
            expirationdDate: null,
        });
    });

    it('should throw an error if user does not own this url and is not an admin', async () => {
        const ID = '701db3f5-59f1-443c-beeb-50ff31c5b14f';
        const USER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';

        await expect(urlService.getUrlById(ID, USER_ID)).rejects.toThrow(
            Forbidden
        );
    });

    it('should throw an error if invalid value was passed to id', async () => {
        const INVALID_IDS = [null, undefined, 0, false, NaN, 'DUMMY'];
        const USER_ID = '3b365a11-97a3-4d44-8137-b944cade14da';

        INVALID_IDS.forEach(async (id) => {
            await expect(urlService.getUrlById(id, USER_ID)).rejects.toThrow(
                NotFound
            );
        });
    });

    it('should throw an error if invalid value was passed to userId', async () => {
        const ID = '701db3f5-59f1-443c-beeb-50ff31c5b14f';
        const INVALID_USER_IDS = [null, undefined, 0, false, NaN, 'dummy'];

        INVALID_USER_IDS.forEach(async (userId) => {
            await expect(urlService.getUrlById(ID, userId)).rejects.toThrow(
                NotFound
            );
        });
    });
});
