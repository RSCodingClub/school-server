const log = require('npmlog')
const express = require('express')
const router = require('./router')

const app = express()
const { PORT } = process.env

app.use('/', router)

app.listen(PORT || 3000, function () {
  let { address, port } = this.address()
  // eslint-disable-next-line no-console
  log.info('server', 'listening at %s:%d', address, port)
})
