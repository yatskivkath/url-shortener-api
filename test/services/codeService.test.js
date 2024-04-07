jest.mock('../../src/repositories/urlRepository.js', () => {
    const urls = [
        {
            id: '786e6338-c83e-45a8-a1a2-4c7ea6888ed1',
            code: 'l3v',
            url: 'https://google.com',
            name: 'Google',
            visits: 1,
            user_id: '3b365a11-97a3-4d44-8137-b944cade14da',
            expiration_date: null,
            type: 'P',
            enabled: true,
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
        },
        {
            id: 'bd508a13-bf19-4250-be0c-01252b304aea',
            code: '6b8',
            url: 'https://google.com',
            name: 'Google',
            visits: 1,
            user_id: '3b365a11-97a3-4d44-8137-b944cade14da',
            expiration_date: null,
            type: 'OT',
            enabled: false,
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
        },
    ];

    return {
        findUrlByCode: jest.fn().mockImplementation((code) => {
            return urls.find((url) => url.code === code);
        }),
    };
});

const codeService = require('../../src/services/codeService.js');

describe('Code Service', () => {
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

        expect(result).toBe(null);
    });

    it('should return NULL if code was not provided', async () => {
        const CODE = undefined;

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBe(null);
    });

    it('should return NULL if code is empty string', async () => {
        const CODE = '';

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBe(null);
    });

    it('should return NULL if url is inactive', async () => {
        const CODE = '6b8';

        const result = await codeService.getUrlToRedirect(CODE);

        expect(result).toBe(null);
    });

    it('should return NULL if url is expired', async () => {
        // test implementation here
    });

    it('should return NULL if url is of ONE-TIME type and has been already visited', () => {
        // test implementation here
    });
});
