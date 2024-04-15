jest.mock('../../../src/repositories/urlRepository.js', () => {
    const urls = [
        {
            id: '786e6338-c83e-45a8-a1a2-4c7ea6888ed1',
            code: 'l3v',
            url: 'https://google.com',
            name: 'Google',
            visits: 1,
            userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            expirationdDate: null,
            type: 'P',
            typeParsed: 'Permanent',
            enabled: true,
            active: true,
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
        },
        {
            id: 'bd508a13-bf19-4250-be0c-01252b304aea',
            code: '6b8',
            url: 'https://google.com',
            name: 'Google',
            visits: 1,
            userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            expirationdDate: null,
            type: 'OT',
            typeParsed: 'One-Time',
            enabled: false,
            active: false,
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
        },
        {
            id: '83d29972-9543-418f-90e2-270bf9cda48b',
            code: 'uU1',
            url: 'https://google.com',
            name: 'Google',
            visits: 13,
            userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            expirationdDate: '2023-04-19 02:00:00+02',
            type: 'T',
            typeParsed: 'Temporary',
            enabled: false,
            active: false,
            createdAt: '2022-04-07T10:09:27.843Z',
            updatedAt: '2022-04-07T10:09:42.750Z',
        },
    ];

    return {
        findUrlByCode: jest.fn().mockImplementation((code) => {
            return urls.find((url) => url.code === code);
        }),
        saveUrl: jest.fn().mockImplementation((url) => {
            urls.push(url);
            return url;
        }),
        updateUrl: jest.fn().mockImplementation((url) => {
            const index = urls.findIndex((u) => u.id === url.id);
            urls[index] = {
                ...urls[index],
                ...url,
            };
            return url;
        }),
    };
});

jest.mock('../../../src/repositories/userRepository.js', () => {
    return {
        findUserById: jest.fn().mockImplementation((id) => ({
            id: 'c9bb5609-4588-4d7d-bb18-c3e430ac7377',
            email: 'test1@mail.com',
            password: 'hashedtest1',
            first_name: 'John',
            last_name: 'Doe',
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
            role: 'admin',
        })),
    };
});

const urlService = require('../../../src/services/urlService.js');
const codeService = require('../../../src/services/codeService.js');

describe('Code Service getUrlToRedirect function', () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it('should return an original url to redirect by provided code', async () => {
        const CODE = 'l3v';
        const REDIRECT_URL = 'https://google.com';

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBe(REDIRECT_URL);
    });

    it('should return NULL if code was not found', async () => {
        const CODE = 'l3EEEv';

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBeNull();
    });

    it('should return NULL if code was not provided', async () => {
        const CODE = undefined;

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBeNull();
    });

    it('should return NULL if code is empty string', async () => {
        const CODE = '';

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBeNull();
    });

    it('should return NULL if url is not enabled', async () => {
        const CODE = '6b8';

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBeNull();
    });

    it('should return NULL if url is expired', async () => {
        const CODE = 'uU1';

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBeNull();
    });

    it('should return NULL if url is of ONE-TIME type and has been already visited', async () => {
        const URL = {
            code: 'test',
            url: 'https://google.com',
            name: 'Google',
            type: 'OT',
        };

        const userId = '3b365a11-97a3-4d44-8137-b944cade14da';

        await urlService.createUrl(URL, userId);
        urlService.visitUrl(URL.code);

        const result = await codeService.getUrlToRedirect(URL.code);
        expect(result).toBeNull();
    });
});
