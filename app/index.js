require('./insights').setup()
require('log-timestamp')
const polling = require('./polling')
const messageService = require('./messaging')

const handleSignals = async () => {
  await messageService.stop()
  process.exit(0)
}

process.on('SIGTERM', handleSignals)
process.on('SIGINT', handleSignals)

const start = async () => {
  await polling.start()
  await messageService.start()
}

(async () => {
  await start()
})()

module.exports = {
  start,
  handleSignals
}
