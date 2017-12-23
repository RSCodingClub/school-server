const { promisify } = require('util')
const User = require('../classes/User')
const redisClient = require('../redis')
const userResolver = require('./User')

async function leaderboardResolver ({ limit, index = 0, after }) {
  if (after != null) {
    let user = new User(after)
    // Ignore -1 if doesnt exist and just start from the beginning
    index = Math.max(await user.getLeaderboardIndex(), 0)
  }
  // If limit doesn't exist get the entire leaderboard
  if (limit == null || isNaN(limit)) {
    limit = await promisify(redisClient.zcard).call(redisClient, 'leaderboard')
  }
  // Map user id's to User objects
  let leaderboard = (await promisify(redisClient.zrevrange).call(redisClient, ['leaderboard', index, limit - 1])).map(id => userResolver({ id: id }))
  return leaderboard
}

module.exports = leaderboardResolver
