const mongoose = require('mongoose')
const logger = require ('./logger').logger
require('dotenv').config()

mongoose.connection.on('connected', () => logger.pino.info('connected to the database'))
mongoose.connection.on('open', () => logger.pino.info('connection open to the database'))
mongoose.connection.on('disconnected', () => logger.pino.info('Disconnected to the database'))
mongoose.connection.on('reconnected', () => logger.pino.info('Reconnected to the database'))
mongoose.connection.on('close', () => logger.pino.info('connection to the database is close'))

mongoose.connect(`mongodb://localhost:${process.env.PORT_BDD}/${process.env.npm_lifecycle_event === 'test'? "CDA_FRENCHTRAVEL_TEST":"CDA_FRENCHTRAVEL_PRODUCTION"}`)

//CDA_FRENCHTRAVEL_PRODUCTION