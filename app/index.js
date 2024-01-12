require('./insights').setup()
require('log-timestamp')
const polling = require('./polling')
const messageService = require('./messaging')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messageService.stop()
  process.exit(0)
})

module.exports = (async () => {
  polling.start()
  await messageService.start()
})()
