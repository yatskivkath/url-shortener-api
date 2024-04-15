const { NotFound } = require('../../../src/errors/errors.js');

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
    ];

    return {
        findUrlByCode: jest.fn().mockImplementation((code) => {
            return urls.find((url) => url.code === code) ?? null;
        }),
    };
});

jest.mock('../../../src/repositories/userRepository.js', () => {
    return {};
});

describe('Url Service getUrlByCodePublic function', () => {
    const urlService = require('../../../src/services/urlService.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return the url by code', async () => {
        const CODE = 'tlwnd';
        const url = await urlService.getUrlByCodePublic(CODE);

        expect(url).toEqual({
            typeParsed: 'Permanent',
            active: true,
            shortUrl: 'http://localhost:3001/redirect/tlwnd',
            userId: 'c9bb5609-4588-4d7d-bb18-c3e430ac7377',
            id: '701db3f5-59f1-443c-beeb-50ff31c5b14f',
            url: 'https://tailwindcss.com/',
            name: 'Tailwind',
            code: 'tlwnd',
            visits: 2,
            type: 'P',
            enabled: false,
            expirationdDate: null,
        });
    });

    it('should throw an error if url is not found', async () => {
        const CODE = 'dummy';

        await expect(urlService.getUrlByCodePublic(CODE)).rejects.toThrow(
            NotFound
        );
    });

    it('should throe an error if invalid value was passed', async () => {
        const INVALID_CODES = [null, undefined, 0, ''];

        INVALID_CODES.forEach(async (code) => {
            await expect(urlService.getUrlByCodePublic(code)).rejects.toThrow(
                NotFound
            );
        });
    });
});
