require('./insights').setup()
require('log-timestamp')
const polling = require('./polling')
const messageService = require('./messaging')

async function handleSignals () {
  await messageService.stop()
  process.exit(0)
}

process.on('SIGTERM', handleSignals)
process.on('SIGINT', handleSignals)

module.exports = {
  start: async () => {
    polling.start()
    await messageService.start()
  },
  handleSignals
}
