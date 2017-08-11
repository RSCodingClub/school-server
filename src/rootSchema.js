
const { buildSchema } = require('graphql')

let schema = buildSchema(`
  type Query {
    hello: String
  }
`)

let root = {
  // TODO: Return server status
  status: () => 'ok'
}

module.exports.schema = schema
module.exports.root = root
