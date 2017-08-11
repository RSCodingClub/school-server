
const { buildSchema } = require('graphql')

let schema = buildSchema(`
  type Query {
    status: String
  }
`)

let root = {
  // TODO: Return server status
  status: () => 'ok'
}

module.exports.schema = schema
module.exports.root = root
