const express = require("express")
const Config = require("./config")
const bodyParser = require("body-parser")
const Logger = require('./utils/logger').logger.pino
const database = require('./middlewares/database')
const loggerHttp = require('./middlewares/loggerHttp')


const PlaceControllers = require("./controllers/PlaceController").PlaceControllers
const ApiLocationControllers = require("./controllers/ApiLocationController").ApiLocationControllers

//Create express.js app
const app = express()

require("./utils/database")

app.use(bodyParser.json(), loggerHttp.addLogger)

//routes for Place

app.post('/place',database.controlsBDD,PlaceControllers.addOnePlace)


//routes for api call
    //routes for geocodes
app.get('/getlocation',ApiLocationControllers.getDataGeocode)

app.listen(Config.port, () => {
    Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})

module.exports = app