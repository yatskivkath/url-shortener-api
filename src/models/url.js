'use strict';

const { Model } = require('sequelize');
const { WEB_DOMAIN } = require('../constants/domain.js');

module.exports = (sequelize, DataTypes) => {
    class Url extends Model {
        static associate(models) {
            Url.belongsTo(models.user, {
                foreignKey: 'user_id',
                onDelete: 'casscade',
                onUpdate: 'casscade',
            });
        }
    }

    Url.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                type: DataTypes.UUID,
            },
            code: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            url: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            visits: {
                allowNull: false,
                defaultValue: 0,
                type: DataTypes.INTEGER,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            expiration_date: {
                type: DataTypes.DATE,
            },
            type: {
                allowNull: false,
                type: DataTypes.ENUM('P', 'T', 'OT'),
            },
            enabled: {
                allowNull: false,
                defaultValue: true,
                type: DataTypes.BOOLEAN,
            },
            short_url: {
                type: DataTypes.VIRTUAL,
                get() {
                    return `${WEB_DOMAIN}/redirect/${this.code}`;
                },
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'url',
            tableName: 'urls',
        }
    );

    Url.addScope('publicScope', {
        attributes: [
            'id',
            'short_url',
            'url',
            'code',
            'visits',
            'type',
            'enabled',
            'expiration_date',
        ],
    });

    return Url;
};
