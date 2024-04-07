'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('users', 'role', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'user',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('users', 'role');
    },
};
