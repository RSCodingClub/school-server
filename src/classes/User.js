
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
}

module.exports = User
