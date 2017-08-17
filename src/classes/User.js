
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
}

module.exports = User
