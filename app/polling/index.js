const { processingConfig } = require('../config')
const pollInbound = require('./poll-inbound')

const start = async () => {
  try {
    if (processingConfig.pollingActive) {
      await pollInbound()
    }
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, processingConfig.pollingInterval)
  }
}

module.exports = {
  start
}
