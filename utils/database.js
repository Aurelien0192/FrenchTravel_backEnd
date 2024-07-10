const mongoose = require('mongoose')
const logger = require ('./logger').logger

mongoose.connection.on('connected', () => logger.pino.info('connected to the database'))
mongoose.connection.on('open', () => logger.pino.info('connection open to the database'))
mongoose.connection.on('disconnected', () => logger.pino.info('Disconnected to the database'))
mongoose.connection.on('reconnected', () => logger.pino.info('Reconnected to the database'))
mongoose.connection.on('close', () => logger.pino.info('connection to the database is close'))

mongoose.connect(`mongodb://localhost:27017/${process.env.npm_lifecycle_event === 'test'? "CDA_FRENCHTRAVEL_TEST":"CDA_FRENCHTRAVEL_PRODUCTION"}`)