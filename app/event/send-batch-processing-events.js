const { processingConfig, messagingConfig } = require('../config')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { PAYMENT_EXTRACTED } = require('../constants/events')

const sendBatchProcessedEvents = async (paymentRequests, filename, fileType) => {
  if (processingConfig.useV2Events) {
    await sendV2BatchProcessedEvents(paymentRequests, filename, fileType)
  }
}

const sendV2BatchProcessedEvents = async (paymentRequests, filename, fileType) => {
  if (paymentRequests.length) {
    const events = paymentRequests.map(paymentRequest => createEvent(paymentRequest, filename, fileType))
    const eventPublisher = new EventPublisher(messagingConfig.eventsTopic)
    await eventPublisher.publishEvents(events)
  }
}

const createEvent = (paymentRequest, filename, fileType) => {
  return {
    source: SOURCE,
    type: PAYMENT_EXTRACTED,
    subject: filename,
    data: {
      fileTypeId: fileType.fileTypeId,
      ...paymentRequest
    }
  }
}

module.exports = sendBatchProcessedEvents
