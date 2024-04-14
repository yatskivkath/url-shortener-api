'use strict';

const { Model } = require('sequelize');
const { WEB_DOMAIN } = require('../constants/domain.js');

module.exports = (sequelize, DataTypes) => {
    class Url extends Model {
        static associate(models) {
            Url.belongsTo(models.user, {
                foreignKey: 'userId',
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
            userId: {
                field: 'user_id',
                allowNull: false,
                type: DataTypes.UUID,
            },
            expirationdDate: {
                field: 'expiration_date',
                type: DataTypes.DATE,
            },
            type: {
                allowNull: false,
                type: DataTypes.ENUM('P', 'T', 'OT'),
            },
            typeParsed: {
                type: DataTypes.VIRTUAL,
                get() {
                    switch (this.type) {
                        case 'P':
                            return 'Permanent';
                        case 'T':
                            return 'Temporary';
                        case 'OT':
                            return 'One-Time';
                        default:
                            return 'Unknown';
                    }
                },
            },
            enabled: {
                allowNull: false,
                defaultValue: true,
                type: DataTypes.BOOLEAN,
            },
            active: {
                type: DataTypes.VIRTUAL,
                get() {
                    console.log(this.expirationdDate);
                    if (this.expirationdDate) {
                        return (
                            this.enabled && this.expirationdDate > new Date()
                        );
                    }

                    return this.enabled;
                },
            },
            shortUrl: {
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
            'shortUrl',
            'url',
            'name',
            'code',
            'visits',
            'type',
            'typeParsed',
            'enabled',
            'expirationdDate',
            'active',
        ],
    });

    return Url;
};
