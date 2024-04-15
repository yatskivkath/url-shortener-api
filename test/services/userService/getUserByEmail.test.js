const {
    ValidationError,
    NotFound,
    BadRequest,
} = require('../../../src/errors/errors.js');

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
        },
    ];

    return {
        findUserByEmail: jest.fn().mockImplementation((email, scope) => {
            return users.find((user) => user.email === email);
        }),
    };
});

describe('User Service getUserByEmail function', () => {
    const userService = require('../../../src/services/userService.js');

    beforeEach(() => {
        jest.resetModules();
    });

    it('should return a user by provided email', async () => {
        const EMAIL = 'test1@mail.com';
        const USER = {
            id: 'c9bb5609-4588-4d7d-bb18-c3e430ac7377',
            email: 'test1@mail.com',
            password: 'hashedtest1',
            first_name: 'John',
            last_name: 'Doe',
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
        };

        const result = await userService.getUserByEmail(EMAIL);

        expect(result).toEqual(USER);
    });

    test('should throw an error if user is not found', async () => {
        const EMAIL = 'test3@mail.com';

        await expect(userService.getUserByEmail(EMAIL)).rejects.toThrow(
            BadRequest
        );
    });

    test('should throw an error if invalid value was passed to email', async () => {
        const INVALID_EMAILS = [null, undefined, 0, false, NaN];

        INVALID_EMAILS.forEach(async (email) => {
            await expect(userService.getUserByEmail(email)).rejects.toThrow(
                ValidationError
            );
        });
    });
});
