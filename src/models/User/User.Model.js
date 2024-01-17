const { DataTypes } = require('sequelize');
const { dbConnection } = require('../../database/connection');


const UserModel = dbConnection.define('Users', {
    UserId: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    PhoneNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Explorer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    Owner: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    SavedProperties: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    ProfilePhoto: {
        allowNull: true,
        type: DataTypes.STRING(255),
        collate: 'utf8mb4_general_ci',
        defaultValue: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
    }
});

module.exports = { UserModel };
