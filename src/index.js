const log = require('npmlog')
const express = require('express')
const redis = require('redis')
const router = require('./router')

const app = express()
const {
  PORT,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_DB
} = process.env

const redisClient = redis.createClient({
  host: REDIS_HOST || '127.0.0.1',
  port: REDIS_PORT || 6379,
  db: REDIS_DB || 0,
  password: REDIS_PASSWORD
})

redisClient.on('error', (error) => {
  // eslint-disable-next-line no-consoles
  console.error('Redis Error: ', error)
})

app.use('/', router)

app.listen(PORT || 3000, function () {
  let { address, port } = this.address()
  // eslint-disable-next-line no-console
  log.info('server', 'listening at %s:%d', address, port)
})
