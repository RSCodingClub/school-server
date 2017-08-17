
const redisClient = require('../redis')

const User = class User {
  constructor (userId) {
    this.id = userId
  }
  isRegistered () {
    return new Promise((resolve, reject) => {
      redisClient.exists(`user:${this.id}`, (err, exists) => {
        if (err) return reject(err)
        return resolve(Boolean(Number(exists)))
      })
    })
  }
  getName () {
    return new Promise((resolve, reject) => {
      redisClient.hget(`user:${this.id}`, 'name', (err, name) => {
        if (err) return reject(err)
        return resolve(name.toString())
      })
    })
  }
  setName (newName) {
    return new Promise((resolve, reject) => {
      redisClient.hset(`user:${this.id}`, 'name', newName.toString().trim(), (err, name) => {
        if (err) return reject(err)
        return resolve(name)
      })
    })
  }
  setBadge (badgeId, hasBadge) {
    // Force hasBadge to either 0 or 1
    let bit = Math.max(0, Math.min(1, Number(Boolean(hasBadge || false))))
    if (isNaN(bit)) bit = 0

    return new Promise((resolve, reject) => {
      redisClient.bitfield(`user:${this.id}:badges`, 'set', 'u1', badgeId, bit, (err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }
  hasBadge (badgeId) {
    return new Promise((resolve, reject) => {
      redisClient.bitfield(`user:${this.id}:badges`, 'get', 'u1', badgeId, (err, hasBadge) => {
        console.log(badgeId, err, hasBadge)
        if (err) return reject(err)
        return resolve(Boolean(hasBadge[0] || 0))
      })
    })
  }
  addBadge (badgeId) {
    return this.setBadge(badgeId, true)
  }
  takeBadge (badgeId) {
    return this.setBadge(badgeId, false)
  }
  getBadges (encoding = 'base64') {
    return new Promise((resolve, reject) => {
      redisClient.get(Buffer.from(`user:${this.id}:badges`), (err, badgesBuffer) => {
        if (err) return reject(err)
        return resolve(badgesBuffer.toString(encoding) || '')
      })
    })
  }
}

module.exports = User
