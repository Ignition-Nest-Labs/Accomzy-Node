const { Sequelize } = require("sequelize");
const { dbLocalConfig, dbProdConfig } = require("./config");

const dotenv = require("dotenv");
const config = dotenv.config().parsed.NODE_ENV === "local" ? dbLocalConfig : dbProdConfig;


const sequelizeConfig = new Sequelize(
    config.dbName,
    config.user,
    config.dbPassword,

    {
        host: dbLocalConfig.host,
        dialect: "mysql",
        logging: false,
        port: dbLocalConfig.dbPort,
    }
);


module.exports = { sequelizeConfig, config };