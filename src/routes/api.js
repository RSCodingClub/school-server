const jwt = require('express-jwt')
const jwksRsa = require('jwks-rsa')
const { Router } = require('express')
const graphqlHTTP = require('express-graphql')

const User = require('../classes/User')
const rootSchema = require('../rootSchema')

const GOOGLE_CERTS_URI = 'https://www.googleapis.com/oauth2/v3/certs'
const { GOOGLE_SUITE_DOMAIN, GOOGLE_AUD, NODE_ENV } = process.env

if (!(NODE_ENV || 'production').startsWith('dev') && GOOGLE_AUD == null) {
  throw new Error('GOOGLE_AUD is not set')
}

let router = Router({ mergerParams: true })
router.use(jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 15,
    jwksUri: GOOGLE_CERTS_URI
  }),
  requestProperty: 'googleUser',
  audience: GOOGLE_AUD,
  issuer: [
    'https://accounts.google.com',
    'accounts.google.com'
  ],
  algorithms: [ 'RS256' ]
}))

router.use((req, res, next) => {
  if (GOOGLE_SUITE_DOMAIN != null && req.googleUser.hd !== GOOGLE_SUITE_DOMAIN) {
    let error = new Error('Invalid Google Google Suite Domain')
    error.name = 'UnauthorizedError'
    return next(error)
  }
  return next()
})

router.use(async (request, response, next) => {
  if (request.googleUser == null) return next()
  let { sub: id, name } = request.googleUser
  request.user = new User(id)
  try {
    let registered = await request.user.isRegistered()
    if (registered) return next()

    // Register user if they don't exist yet
    await request.user.setName(name)
    return next()
  } catch (loginError) {
    return next(loginError)
  }
})

router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      errors: [{
        message: err.message
      }]
    })
  }
  return next(err)
})

router.get('/', (request, response) => {
  response.status(200).json({
    status: 'ok'
  })
})

router.use('/graphql', graphqlHTTP({
  schema: rootSchema.schema,
  rootValue: rootSchema.resolver,
  graphiql: true
}))

module.exports = router
