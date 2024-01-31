const { DataTypes } = require('sequelize');
const { dbConnection } = require('../../database/connection');

const InstitutesModel = dbConnection.define('Institutes', {
    InstituteName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        primaryKey: true,

    }

},{
    timestamps: false,
    tableName: 'Institutes'
});

module.exports = { InstitutesModel };