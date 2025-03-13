require('log-timestamp')
require('./insights').setup()

const polling = require('./polling')
const messageService = require('./messaging')
const { processingConfig } = require('./config')
const { start: startServer } = require('./server')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messageService.stop()
  process.exit(0)
})

const startApp = async () => {
  await startServer()
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
