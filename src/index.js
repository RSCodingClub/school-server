const express = require('express')

const app = express()
const { PORT } = process.env

app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.listen(PORT || 3000, function () {
  let { address, port } = this.address()
  // eslint-disable-next-line no-console
  console.log(`Server listening at ${address}${port}`)
})
