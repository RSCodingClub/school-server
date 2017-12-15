const log = require('npmlog')

const {
  NODE_ENV,
  LOG_PREFIX,
  LOG_LEVEL,
  LOG_COLOR
} = process.env

// Set log prefix/heading
log.heading = LOG_PREFIX || 'school-server'
// If LOG_COLOR is set enable color output
if (LOG_COLOR != null) log.enableColor()
// Set logging level if LOG_LEVEL exists
if (LOG_LEVEL != null && LOG_LEVEL !== '') log.level = LOG_LEVEL
// Override log level if testing
if (NODE_ENV === 'test') log.level = 'silent'

module.exports = log
