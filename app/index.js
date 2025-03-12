require('log-timestamp')
require('./insights').setup()

const polling = require('./polling')
const messageService = require('./messaging')
const { processingConfig } = require('./config')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messageService.stop()
  process.exit(0)
})

const startApp = async () => {
  if (processingConfig.processingActive) {
    await polling.start()
    await messageService.start()
  } else {
    console.info('Processing capabilities are currently not enabled in this environment')
  }
}

(async () => {
  await startApp()
})()

module.exports = startApp
