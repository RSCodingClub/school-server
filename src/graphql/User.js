const badgeResolver = require('./Badge')
const User = require('../classes/User')

async function userResolver ({ id }) {
  let user = new User(id)
  return {
    id: user.id,
    name: async () => {
      let name = await user.getName()
      return name
    },
    email: async () => {
      let email = await user.getEmail()
      return email
    },
    image: async () => {
      let image = await user.getImage()
      return image
    },
    score: async () => {
      let score = await user.getScore()
      return score
    },
    // NOTE: Potentially implement sorting by id or other feature other than reward value
    badges: async ({ limit = Infinity, index = 0 }) => {
      let badgeIds = await user.getBadges()
      let badges = (await Promise.all(badgeIds.map(badgeId => badgeResolver({ id: badgeId }))))
        .sort((a, b) => {
          if (b == null) return false
          return a.reward < b.reward
        })
      return badges.slice(index, index + limit)
    },
    rank: async () => {
      let rank = await user.getLeaderboardIndex() + 1
      // If unranked give null
      if (rank < 1) return null
      return rank
    }
  }
}

module.exports = userResolver
