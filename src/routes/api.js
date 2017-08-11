const { Router } = require('express')
const graphqlHTTP = require('express-graphql')

const rootSchema = require('../rootSchema')

let router = Router({ mergerParams: true })
router.get('/', (request, response) => {
  response.status(200).json({
    status: 'ok'
  })
})

router.use('/graphql', graphqlHTTP({
  schema: rootSchema.schema,
  rootValue: rootSchema.root,
  graphiql: true
}))

module.exports = router
