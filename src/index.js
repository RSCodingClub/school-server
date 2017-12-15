const express = require('express')
const bodyParser = require('body-parser')
const log = require('./logger')
const router = require('./router')

const app = express()
const {
  PORT
} = process.env

// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', router)

app.listen(PORT || 3000, function () {
  let { address, port } = this.address()
  log.info('server', 'listening at %s:%d', address, port)
})
