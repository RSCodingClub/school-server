const log = require('npmlog')
const amqplib = require('amqplib')

const {
  AMQP_HOST,
  AMQP_PORT
} = process.env

const amqpClient = amqplib.connect(`amqp://${AMQP_HOST || '127.0.0.1'}:${AMQP_PORT || 5672}`)

amqpClient.then((connection) => {
  log.info('amqp', 'connected %s:%d', AMQP_HOST || '127.0.0.1', AMQP_PORT || 5672)
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
