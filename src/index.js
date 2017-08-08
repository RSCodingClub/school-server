const { promisify } = require('util')
const express = require('express')

const app = express()
const { PORT } = process.env

let serverPromise = promisify(app.listen)(PORT || 3000)

app.get('/', (request, response) => {
  response.send('Hello World!')
})

serverPromise.then(() => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT || 3000}`)
}).catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Startup Error:', error)
})

module.exports = serverPromise
