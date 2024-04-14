'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.url, {
                foreignKey: 'userId',
                onDelete: 'casscade',
                onUpdate: 'casscade',
            });
        }
    }

    User.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                type: DataTypes.UUID,
            },
            first_name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            last_name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            email: {
                unique: true,
                allowNull: false,
                type: DataTypes.STRING,
                //TODO add validator
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            role: {
                allowNull: false,
                type: DataTypes.ENUM('admin', 'user'),
                defaultValue: 'user',
            },
        },
        {
            sequelize,
            modelName: 'user',
            tableName: 'users',
        }
    );

    User.addScope('publicScope', {
        attributes: ['id', 'first_name', 'last_name', 'email'],
    });

    User.afterCreate(async (user) => {
        delete user.dataValues.password;
    });

    return User;
};
