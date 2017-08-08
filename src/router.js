const { Router } = require('express')
const index = require('./routes/index')

let router = Router({ mergerParams: true })
router.use('/', index)

module.exports = router
