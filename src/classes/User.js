
const { promisify } = require('util')
const log = require('../logger')
let redisClient = require('../redis')
const amqplib = require('../amqplib')

const { REDIS_PREFIX, REDIS_DB } = process.env

const User = class User {
  constructor (userId) {
    log.silly('user', 'new user(id: %d) constructed', userId)
    if (userId == null) throw new Error('UserId must be defined')
    this.id = userId
    this.amqpChannel = amqplib.getChannel()
  }
  async delete () {
    log.silly('user', 'deleting user(id: %d)', this.id)
    // Get all keys associated with the user, then remove prefix so delete finds them
    // NOTE: 50 is an arbitrary number for the count of max number of keys to return, it should be small, but larger than expected
    let keys = (await promisify(redisClient.scan).call(redisClient, [REDIS_DB || 0, 'MATCH', `${REDIS_PREFIX || 'school-server:'}user:${this.id}:*`, 'COUNT', 50]))[1]
      .map(key => key.substr(REDIS_PREFIX || 'school-server:'.length))
    // If any keys exist delete them
    if (keys.length > 0) await promisify(redisClient.del).call(redisClient, keys)

    let channel = await this.amqpChannel
    await channel.assertQueue('user:name:updated', { durable: true })
    channel.sendToQueue('user:deleted', Buffer.from(JSON.stringify({
      id: this.id
    })))
  }
  async isRegistered () {
    log.silly('user', 'checking if user(id: %d) exists', this.id)
    let exists = await promisify(redisClient.exists).call(redisClient, `user:${this.id}:name`)
    return Boolean(Number(exists))
  }
  async getName () {
    log.silly('user', 'getting users(id: %d) name', this.id)
    let name = await promisify(redisClient.get).call(redisClient, `user:${this.id}:name`)
    return name || ''
  }
  async setName (newName) {
    log.silly('user', 'setting users(id: %d) name', this.id)
    await promisify(redisClient.set).call(redisClient, `user:${this.id}:name`, newName.toString().trim())

    let channel = await this.amqpChannel
    await channel.assertQueue('user:name:updated', { durable: true })
    channel.sendToQueue('user:name:updated', Buffer.from(JSON.stringify({
      id: this.id,
      name: newName
    })))

    return newName
  }
  async getEmail () {
    log.silly('user', 'getting users(id: %d) email', this.id)
    return promisify(redisClient.get).call(redisClient, `user:${this.id}:email`)
  }
  async setEmail (newEmail) {
    log.silly('user', 'setting users(id: %d) email', this.id)
    await promisify(redisClient.set).call(redisClient, `user:${this.id}:email`, newEmail.toString().trim())

    let channel = await this.amqpChannel
    await channel.assertQueue('user:email:updated', { durable: true })
    channel.sendToQueue('user:email:updated', Buffer.from(JSON.stringify({
      id: this.id,
      email: newEmail
    })))

    return newEmail
  }
  async getImage () {
    log.silly('user', 'getting users(id: %d) image', this.id)
    return promisify(redisClient.get).call(redisClient, `user:${this.id}:image`)
  }
  async setImage (newImage) {
    log.silly('user', 'setting users(id: %d) image', this.id)
    await promisify(redisClient.set).call(redisClient, `user:${this.id}:image`, newImage.toString().trim())

    let channel = await this.amqpChannel
    await channel.assertQueue('user:image:updated', { durable: true })
    channel.sendToQueue('user:image:updated', Buffer.from(JSON.stringify({
      id: this.id,
      image: newImage
    })))

    return newImage
  }
  async giveBadge (badges) {
    log.silly('user', 'giving user(id: %d) badge', this.id)
    // Force badges to Array
    if (!(badges instanceof Array)) badges = [ badges ]
    await promisify(redisClient.sadd).call(redisClient, `user:${this.id}:badges`, ...badges)

    let channel = await this.amqpChannel
    await channel.assertQueue('user:badges:updated', { durable: true })
    channel.sendToQueue('user:badges:updated', Buffer.from(JSON.stringify({
      id: this.id,
      removed: [],
      added: badges
    })))

    // NOTE: Maybe return all user badges, or those added
  }
  async takeBadge (badgeId) {
    log.silly('user', 'taking a users(id: %d) badge', this.id)
    await promisify(redisClient.srem).call(redisClient, `user:${this.id}:badges`, badgeId)

    let channel = await this.amqpChannel
    await channel.assertQueue('user:badges:updated', { durable: true })
    channel.sendToQueue('user:badges:updated', Buffer.from(JSON.stringify({
      id: this.id,
      removed: badgeId instanceof Array ? badgeId : [ badgeId ],
      added: []
    })))

    // NOTE: Maybe return all user badges, or those added
  }
  async hasBadge (badgeId) {
    log.silly('user', 'checking if user(id: %d) has badge', this.id)
    if (badgeId == null) throw new Error('BadgeID must be provided')
    let hasBadge = await promisify(redisClient.sismember).call(redisClient, `user:${this.id}:badges`, badgeId)
    return Boolean(Number(hasBadge))
  }
  async getBadges () {
    log.silly('user', 'getting users(id: %d) badges', this.id)
    let badges = await promisify(redisClient.smembers).call(redisClient, `user:${this.id}:badges`)
    if (badges == null) return []
    return badges.map(Number)
  }
  async addScore (scoreIncr) {
    log.silly('user', 'adding to users(id: %d) score', this.id)
    if (isNaN(scoreIncr)) throw new Error('Score must be a number')
    let score = await promisify(redisClient.incrby).call(redisClient, `user:${this.id}:score`, scoreIncr)

    let channel = await this.amqpChannel
    await channel.assertQueue('user:score:updated', { durable: true })
    channel.sendToQueue('user:score:updated', Buffer.from(JSON.stringify({
      id: this.id,
      score: score
    })))

    // NOTE: Maybe return new score
  }
  async setScore (score) {
    log.silly('user', 'setting users(id: %d) score', this.id)
    if (isNaN(score)) throw new Error('Score must be a number')
    await promisify(redisClient.set).call(redisClient, `user:${this.id}:score`, score)

    let channel = await this.amqpChannel
    await channel.assertQueue('user:score:updated', { durable: true })
    channel.sendToQueue('user:score:updated', Buffer.from(JSON.stringify({
      id: this.id,
      score: score
    })))

    // NOTE: Maybe return new score
  }
  async getScore () {
    log.silly('user', 'getting users(id: %d) score', this.id)
    let score = await promisify(redisClient.get).call(redisClient, `user:${this.id}:score`)
    if (isNaN(score)) return 0
    return Number(score)
  }
  async getLeaderboardIndex () {
    log.silly('user', 'getting users(id: %d) rank', this.id)
    let rank = await promisify(redisClient.zrevrank).call(redisClient, 'leaderboard', this.id)
    if (isNaN(rank)) return -1
    return Number(rank)
  }
}

module.exports = User
