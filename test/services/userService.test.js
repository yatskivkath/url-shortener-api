jest.mock('../../src/repositories/userRepository.js', () => {
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
        {
            id: '3b365a11-97a3-4d44-8137-b944cade14da',
            email: 'test2@mail.com',
            password: 'hashedtest2',
            first_name: 'Jane',
            last_name: 'Doe',
            createdAt: '2024-04-07T10:09:27.843Z',
            updatedAt: '2024-04-07T10:09:42.750Z',
        },
    ];

    return {
        findUserByEmail: jest.fn().mockImplementation((email, scope) => {
            return users.find((user) => user.email === email);
        }),
        findUserById: jest.fn().mockImplementation((id, scope) => {
            return users.find((user) => user.id === id);
        }),
        getAllUsers: jest.fn().mockImplementation((scope) => {
            return users.map((user) => ({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            }));
        }),
    };
});

jest.mock('bcrypt', () => {
    return {
        hash: jest.fn().mockImplementation((password) => {
            return `hashed${password}`;
        }),
        compare: jest.fn().mockImplementation((password, hashedPassword) => {
            return `hashed${password}` === hashedPassword;
        }),
    };
});

const e = require('express');
const userService = require('../../src/services/userService.js');

describe('User Service', () => {
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

    test('should throe an error if user is not found', async () => {
        const EMAIL = 'test3@mail.com';

        await expect(userService.getUserByEmail(EMAIL)).rejects.toThrow(
            'User was not found'
        );
    });

    it('should return true if password is correct', async () => {
        const PASSWORD = 'test1';
        const EMAIL = 'test1@mail.com';

        const result = await userService.checkPassword(EMAIL, PASSWORD);

        expect(result).toBeTruthy();
    });

    it('should return false if password is incorrect', async () => {
        const PASSWORD = 'WRONG_PASSWORD';
        const EMAIL = 'test1@mail.com';

        const result = await userService.checkPassword(EMAIL, PASSWORD);

        expect(result).toBeFalsy();
    });

    it('should throe an error if wrong data was passed to password check', async () => {
        await expect(userService.checkPassword(undefined)).rejects.toThrow(
            'User was not found'
        );

        await expect(
            userService.checkPassword('', 'dssd', 12344)
        ).rejects.toThrow('User was not found');

        await expect(userService.checkPassword(null)).rejects.toThrow(
            'User was not found'
        );
    });
});
