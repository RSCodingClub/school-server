
const redisClient = require('../redis')

const User = class User {
  constructor (userId) {
    this.id = userId
  }
  isRegistered () {
    return new Promise((resolve, reject) => {
      redisClient.exists(`user:${this.id}:name`, (err, exists) => {
        if (err) return reject(err)
        return resolve(Boolean(Number(exists)))
      })
    })
  }
  getName () {
    return new Promise((resolve, reject) => {
      redisClient.hget(`user:${this.id}:name`, (err, name) => {
        if (err) return reject(err)
        return resolve(name.toString())
      })
    })
  }
  setName (newName) {
    return new Promise((resolve, reject) => {
      redisClient.set(`user:${this.id}:name`, newName.toString().trim(), (err, name) => {
        if (err) return reject(err)
        return resolve(name)
      })
    })
  }
  giveBadge (badgeId) {
    return new Promise((resolve, reject) => {
      redisClient.sadd(`user:${this.id}:badges`, badgeId, (err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
  takeBadge (badgeId) {
    return new Promise((resolve, reject) => {
      redisClient.srem(`user:${this.id}:badges`, badgeId, (err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
  hasBadge (badgeId) {
    return new Promise((resolve, reject) => {
      redisClient.sismember(`user:${this.id}:badges`, badgeId, (err, hasBadge) => {
        if (err) return reject(err)
        return resolve(Boolean(hasBadge || 0))
      })
    })
  }
  getBadges () {
    return new Promise((resolve, reject) => {
      redisClient.smembers(`user:${this.id}:badges`, (err, badgesSet) => {
        if (err) return reject(err)
        return resolve(badgesSet.map(badge => Number(badge)) || [])
      })
    })
  }
  addScore (score) {
    return new Promise((resolve, reject) => {
      if (isNaN(Number(score))) return reject(new Error('Score must be a number'))
      redisClient.incrby(`user:${this.id}:score`, score, (err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
  setScore (score) {
    return new Promise((resolve, reject) => {
      if (isNaN(Number(score))) return reject(new Error('Score must be a number'))
      redisClient.set(`user:${this.id}:score`, score, (err, score) => {
        if (err) return reject(err)
        return resolve(Number(score || 0))
      })
    })
  }
  getScore () {
    return new Promise((resolve, reject) => {
      redisClient.get(`user:${this.id}:score`, (err, score) => {
        if (err) return reject(err)
        return resolve(Number(score || 0))
      })
    })
  }
}

module.exports = User
