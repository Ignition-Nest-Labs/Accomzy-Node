const { DataTypes } = require('sequelize');
const { dbConnection } = require('../../database/connection');
; // Replace '../config/database' with the actual path to your database configuration

const PropertiesModel = dbConnection.define('Properties', {
    UserId: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    PropertyId: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    PropertyName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    PropertyType: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Area: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    ContactNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Amenities: {
        type: DataTypes.JSON,
        collate: 'utf8mb4_bin',
    },
    PropertyImages: {
        type: DataTypes.JSON,
        collate: 'utf8mb4_general_ci',
    },
    Floors: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Rooms: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Reviews: {
        type: DataTypes.JSON,
        collate: 'utf8mb4_bin',
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,

    },
    Latitude: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Longitude: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    City: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    State: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Landmark: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    PinCode: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Street: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Facilities: {
        type: DataTypes.JSON,
        collate: 'utf8mb4_bin',
    },
    Meals: {
        type: DataTypes.JSON,
        collate: 'utf8mb4_bin',
    },
    Rules: {
        type: DataTypes.JSON,
        collate: 'utf8mb4_bin',
    },
    AdditionalNote: {
        type: DataTypes.TEXT('long'),
        collate: 'utf8mb4_bin',
    },
    Price: {
        type: DataTypes.STRING(255),
        allowNull: false,
        collate: 'utf8mb4_general_ci',
    },
    Approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

});

module.exports = { PropertiesModel };
