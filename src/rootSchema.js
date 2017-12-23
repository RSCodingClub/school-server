
const path = require('path')
const { buildSchema } = require('graphql')
const { fileLoader, mergeTypes } = require('merge-graphql-schemas')

let schema = buildSchema(
  mergeTypes(
    fileLoader(path.join(__dirname, './graphql/schemas'))
  )
)

let resolver = {
  // TODO: Return server status
  status: () => 'ok'
}

module.exports.schema = schema
module.exports.resolver = resolver
