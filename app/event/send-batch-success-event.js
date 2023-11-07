const { processingConfig, messagingConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { BATCH_PROCESSED } = require('../constants/events')

const sendBatchSuccessEvent = async (filename) => {
  if (processingConfig.useEvents) {
    const event = {
      source: SOURCE,
      type: BATCH_PROCESSED,
      subject: filename,
      data: {
        filename
      }
    }
    const eventPublisher = new EventPublisher(messagingConfig.eventsTopic)
    await eventPublisher.publishEvent(event)
  }
}

module.exports = sendBatchSuccessEvent
