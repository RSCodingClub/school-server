const express = require('express')
const router = require('./router')

const app = express()
const { PORT } = process.env

app.use('/', router)

app.listen(PORT || 3000, function () {
  let { address, port } = this.address()
  // eslint-disable-next-line no-console
  console.log(`Server listening at ${address}${port}`)
})
