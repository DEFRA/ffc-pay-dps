const { processingConfig, messagingConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { BATCH_QUARANTINED } = require('../constants/events')

const sendBatchQuarantineEvent = async (filename) => {
  if (processingConfig.useEvents) {
    const event = {
      source: SOURCE,
      type: BATCH_QUARANTINED,
      subject: filename,
      data: {
        message: 'Batch quarantined',
        filename
      }
    }
    const eventPublisher = new EventPublisher(messagingConfig.eventsTopic)
    await eventPublisher.publishEvent(event)
  }
}

module.exports = sendBatchQuarantineEvent
