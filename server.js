const express = require("express")
const Config = require("./config")
const bodyParser = require("body-parser")
const Logger = require('./utils/logger').logger.pino
const database = require('./middlewares/database')
const loggerHttp = require('./middlewares/loggerHttp')
const multer = require('./middlewares/multer.config')
const path = require('path')


const PlaceControllers = require("./controllers/PlaceController").PlaceControllers
const ApiLocationControllers = require("./controllers/ApiLocationController").ApiLocationControllers
const ImageController = require('./controllers/ImageController').ImageController

//Create express.js app
const app = express()

require("./utils/database")

app.use(bodyParser.json(), loggerHttp.addLogger)

app.use('/data/images',express.static(path.join(__dirname, '/data/images')))

//routes for Place

app.post('/place',database.controlsBDD,PlaceControllers.addOnePlace)


//routes for api call
    //routes for geocodes
app.get('/getlocation',ApiLocationControllers.getDataGeocode)


//routes images

app.post('/image',multer,ImageController.addOneImage)


app.listen(Config.port, () => {
    Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})



module.exports = app