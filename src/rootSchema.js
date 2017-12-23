const path = require('path')
const { buildSchema } = require('graphql')
const { fileLoader, mergeTypes } = require('merge-graphql-schemas')
const userResolver = require('./graphql/User')
const badgeResolver = require('./graphql/Badge')

let schema = buildSchema(
  mergeTypes(
    fileLoader(path.join(__dirname, './graphql/schemas'))
  )
)

let resolver = {
  // TODO: Return services statuses for each api (badgeService: online, etc...)
  status: 'ok',
  badge: badgeResolver,
  user: userResolver
}

module.exports.schema = schema
module.exports.resolver = resolver
