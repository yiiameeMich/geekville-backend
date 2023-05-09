const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())

app.use('/auth', require('./auth/auth.router'))
app.use('/products', require('./products/products.router'))

const uri = process.env.APP_MONGODB_URL

mongoose.set('runValidators', true)
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const port = process.env.PORT || 3000
app.listen(port)
console.log(`app is listening on port: ${port}`)
