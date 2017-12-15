const redis = require('redis')
const log = require('./logger')

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_DB,
  REDIS_PREFIX
} = process.env

const redisClient = redis.createClient({
  host: REDIS_HOST || '127.0.0.1',
  port: REDIS_PORT || 6379,
  db: REDIS_DB || 0,
  prefix: REDIS_PREFIX || 'school-server:',
  password: REDIS_PASSWORD
})

redisClient.on('error', (error) => {
  log.error('redis', error)
})

redisClient.on('ready', () => {
  log.info('redis', 'connected %s:%d', REDIS_HOST || '127.0.0.1', REDIS_PORT || 6379)
})

redisClient.on('end', () => {
  log.info('redis', 'disconnected')
})

redisClient.on('warning', (warning) => {
  log.warn('redis', warning)
})

module.exports = redisClient
