const { DataTypes } = require('sequelize');
const { dbConnection } = require('../../database/connection');


const AuthTokenModel = dbConnection.define('AuthTokens', {
    UserId: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
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
});

module.exports = { AuthTokenModel };
