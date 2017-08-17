
const { buildSchema } = require('graphql')

let schema = buildSchema(`
  type Query {
    status: String
  }
`)

let resolver = {
  // TODO: Return server status
  status: () => 'ok'
}

module.exports.schema = schema
module.exports.resolver = resolver
