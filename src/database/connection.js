
const { logger } = require('../utils/logger')
const { sequelizeConfig, config } = require('./dbConfig')



const dbConnection = sequelizeConfig

dbConnection
    .authenticate()
    .then(() => {
        console.log(config)
        logger.info('Database  Connection has been established successfully.')
        //mention the connection configs

    })
    .catch(err => {
        console.log(config)
        logger.error('Unable to connect to the database:', err)
    })

module.exports = { dbConnection }