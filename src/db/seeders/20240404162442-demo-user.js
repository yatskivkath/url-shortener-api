'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const hashedPassword = await bcrypt.hash('root', 10);

        await queryInterface.bulkInsert('users', [
            {
                first_name: 'Admin',
                last_name: 'Admin',
                email: 'root@mail.com',
                password: hashedPassword,
                id: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
                role: 'admin',
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', null, {});
    },
};
