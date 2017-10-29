const log = require('npmlog')
const amqplib = require('amqplib')

const {
  AMQP_HOST,
  AMQP_PORT
} = process.env

const amqpClient = amqplib.connect(`amqp://${AMQP_HOST || '127.0.0.1'}:${AMQP_PORT || 5672}`)

async function getChannel () {
  try {
    const connection = await amqpClient
    const channel = await connection.createChannel()

    log.info('amqp', 'connected %s:%d', AMQP_HOST || '127.0.0.1', AMQP_PORT || 5672)
    process.once('SIGINT', () => {
      log.warn('amqp', 'forcefully closing connection')
      connection.close()
    })

    return channel
  } catch (error) {
    log.error('amqp', error)
  }
}

// Export channel
module.exports.getChannel = getChannel
