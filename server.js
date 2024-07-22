const express = require("express")
const Config = require("./config")
const bodyParser = require("body-parser")
const Logger = require('./utils/logger').logger.pino
const database = require('./middlewares/database')
const loggerHttp = require('./middlewares/loggerHttp')
const multerOneImage = require('./middlewares/multer.config').oneImage
const multerManyImage = require('./middlewares/multer.config').manyImage
const path = require('path')
const session = require('express-session')


//Create express.js app
const app = express()

require("./utils/database")


app.use(session({
  secret : Config.passportConfig.getSecretCookie(),
  resave: false,
  saveUninitialized : true,
  cookie : {secure: true}
}))

app.use(bodyParser.json(), loggerHttp.addLogger)

const passport = require("./utils/passport")
app.use(passport.initialize())
app.use(passport.session())


const UserControllers = require('./controllers/UserController').UserControllers
const PlaceControllers = require("./controllers/PlaceController").PlaceControllers
const ApiLocationControllers = require("./controllers/ApiLocationController").ApiLocationControllers
const ImageController = require('./controllers/ImageController').ImageController
const controleRoleUser = require('./middlewares/controleRoleUser')

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/data/images',express.static(path.join(__dirname, '/data/images')))

//routes for User

app.post('/login',database.controlsBDD, UserControllers.loginUser)
app.post('/user', database.controlsBDD, UserControllers.addOneUser)
app.get('/user/:id', database.controlsBDD, UserControllers.findOneUserById)
app.put('/user/:id', database.controlsBDD, UserControllers.updateOneUser)
app.delete('/user/:id', database.controlsBDD, UserControllers.deleteOneUser)

//routes for Place

app.post('/place',database.controlsBDD, passport.authenticate('jwt',{session:false}),ApiLocationControllers.getDataGeocode,PlaceControllers.addOnePlace)


//routes for api call
    //routes for geocodes
app.get('/getlocation',ApiLocationControllers.getDataGeocode)


//routes images

app.post('/image',multerOneImage,ImageController.addOneImage)
app.post('/images',multerManyImage,ImageController.addManyImages)


app.listen(Config.port, () => {
    Logger.info(`Serveur démarré sur le port ${Config.port}.`)
})

module.exports = app