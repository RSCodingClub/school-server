const { Router } = require('express')
const index = require('./routes/index')
const api = require('./routes/api')

let router = Router({ mergerParams: true })
router.use('/', index)
router.use('/api', api)

module.exports = router
