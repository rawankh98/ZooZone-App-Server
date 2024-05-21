'use strict';
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
require('dotenv').config()
const animalRoute = require('./routes/animal')
const PORT = process.env.PORT || 8090
const bodyParser = require('body-parser');




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())

app.use("/animals", animalRoute)


app.get('/', (req, res) => res.send("WELCOME !!"));




app.listen(PORT)

