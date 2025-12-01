const config = require('../config/processing')
const messageConfig = require('../config/messaging')
const { EventPublisher } = require('ffc-pay-event-publisher')

const sendCustomerUpdateFailureEvent = async (data, type, error) => {
  if (config.useEvents) {
    const event = {
      source: 'ffc-pay-dps',
      type,
      subject: invoiceNumber,
      data: {
        message: error,
        ...data
      }
    }
    const eventPublisher = new EventPublisher(messageConfig.eventsTopic)
    await eventPublisher.publishEvent(event)
  }
}

module.exports = sendCustomerUpdateFailureEvent
