const log = require('npmlog')
const redis = require('redis')

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

module.exports = redisClient
