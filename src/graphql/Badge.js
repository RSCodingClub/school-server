
async function badgeResolver ({ id }) {
  return {
    id: id,
    name: 'Name',
    description: 'Desc',
    reward: Math.random() > 0.5 ? Math.floor(Math.random() * 100 + 1) : null
  }
}

module.exports = badgeResolver
