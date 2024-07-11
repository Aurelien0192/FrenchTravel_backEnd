const LoggerHttp = require('../utils/logger').logger.pino_http


module.exports.addLogger = (req, res, next) => {
    LoggerHttp(req, res)
    next()
}