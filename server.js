const express = require("express")
const Config = require("./config")
const bodyParser = require("body-parser")

//Create express.js app
const app = express()

require("./utils/database")

app.use(bodyParser.json())

app.post('/place',)

