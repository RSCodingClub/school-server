
const redisClient = require('../redis')

const User = class User {
  constructor (userId) {
    this.id = userId
  }
}

module.exports = User
