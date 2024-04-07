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
const userService = require('../../../src/services/userService.js');

describe('User Service getUserByEmail function', () => {
    beforeEach(() => {
        jest.resetModules();
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

    it('should return false if wrong data was passed to password check', async () => {
        const result = await userService.checkPassword(
            'WRONG_EMAIL',
            'WRONG_PASSWORD'
        );
        expect(result).toBeFalsy();
    });
});
