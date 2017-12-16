const amqplib = require('amqplib')
const log = require('./logger')

const {
  AMQP_HOST,
  AMQP_PORT,
  AMQP_USER,
  AMQP_PASSWORD
} = process.env

const isAuthenticating = AMQP_USER && AMQP_PASSWORD
const protocol = 'amqp://'
const authentication = encodeURIComponent(AMQP_USER) + ':' + encodeURIComponent(AMQP_PASSWORD) + '@'
const host = AMQP_HOST || '127.0.0.1'
const port = AMQP_PORT || 5672

const uri = protocol + (isAuthenticating ? authentication : '') + host + ':' + port

const amqpClient = amqplib.connect(uri)

amqpClient.then((connection) => {
  log.info('amqp', `connected ${host}:${port}`)
  process.once('SIGINT', () => {
    log.warn('amqp', 'forcefully closing connection')
    connection.close().then(() => {
      log.info('amqp', 'closed connection')
      process.exit(0)
    })
  })
})

async function getChannel () {
  try {
    const connection = await amqpClient
    const channel = await connection.createChannel()

    return channel
  } catch (error) {
    log.error('amqp', error)
    process.exit(1)
  }
}

// Export channel
module.exports.getChannel = getChannel
