const { processingConfig, messagingConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { BATCH_REJECTED } = require('../constants/events')

const sendBatchErrorEvent = async (filename, error) => {
  if (processingConfig.useEvents) {
    const event = {
      source: SOURCE,
      type: BATCH_REJECTED,
      subject: filename,
      data: {
        message: error.message,
        filename
      }
    }
    const eventPublisher = new EventPublisher(messagingConfig.eventsTopic)
    await eventPublisher.publishEvent(event)
  }
}

module.exports = sendBatchErrorEvent
