jest.mock('../../../src/repositories/urlRepository.js', () => {
    const urls = [
        {
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
        },
        {
            typeParsed: 'Permanent',
            active: true,
            shortUrl: 'http://localhost:3001/redirect/QB1jkaqlRt2ViX1',
            id: 'ce63f4d7-bba3-41b0-8c4b-d54367a2348e',
            userId: 'c9bb5609-4588-4d7d-bb18-c3e430ac7377',
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio',
            name: 'Web',
            code: 'QB1jkaqlRt2ViX1',
            visits: 2,
            type: 'P',
            enabled: true,
            expirationdDate: null,
        },
        {
            typeParsed: 'One-Time',
            active: false,
            shortUrl: 'http://localhost:3001/redirect/NR2LA',
            id: 'cb2cbc99-c828-4ebc-87d7-eb088293563e',
            userId: '3b365a11-97a3-4d44-8137-b944cade14da',
            url: 'https://docs.google.com/document/d/1-0w6DXR2DWDR2iRNd4Szd29Jn6m1gTXQBvAR5uAiOE4/edit',
            name: 'Final Project',
            code: 'NR2LA',
            visits: 1,
            type: 'OT',
            enabled: true,
            expirationdDate: null,
        },
    ];

    return {
        getAllUrlsByUserId: jest.fn().mockImplementation((userId) => {
            return urls.filter((url) => url.userId === userId);
        }),
    };
});

jest.mock('../../../src/repositories/userRepository.js', () => {
    return {};
});

describe('Url Service getUrlsByUserPublic function', () => {
    const urlService = require('../../../src/services/urlService.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return all urls by user id', async () => {
        const USER_ID = 'c9bb5609-4588-4d7d-bb18-c3e430ac7377';

        const result = await urlService.getUrlsByUserPublic(USER_ID);

        expect(result).toEqual([
            {
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
            },
            {
                typeParsed: 'Permanent',
                active: true,
                shortUrl: 'http://localhost:3001/redirect/QB1jkaqlRt2ViX1',
                id: 'ce63f4d7-bba3-41b0-8c4b-d54367a2348e',
                userId: 'c9bb5609-4588-4d7d-bb18-c3e430ac7377',
                url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio',
                name: 'Web',
                code: 'QB1jkaqlRt2ViX1',
                visits: 2,
                type: 'P',
                enabled: true,
                expirationdDate: null,
            },
        ]);
    });

    it('should return an empty array if no urls are found', async () => {
        const USER_ID = '28143c34-64cb-444f-9e15-abaf6916e156';

        const result = await urlService.getUrlsByUserPublic(USER_ID);

        expect(result).toEqual([]);
    });

    it('should return an empty array if invalid value was passed', async () => {
        const INVALID_USER_IDS = [null, undefined, 0, false, NaN, 'dummy'];

        INVALID_USER_IDS.forEach(async (id) => {
            const result = await urlService.getUrlsByUserPublic(id);
            expect(result).toEqual([]);
        });
    });
});
