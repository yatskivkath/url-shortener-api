'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Url extends Model {
        static associate(models) {
            Url.belongsTo(models.user);
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
        },
        {
            sequelize,
            modelName: 'url',
            tableName: 'urls',
        }
    );

    return Url;
};
