const { saveUpdate } = require('../customer')
const { sendCustomerUpdateFailureEvent } = require('../event')
const { CUSTOMER_UPDATE_PROCESSING_FAILED } = require('../constants/events')

const processCustomerMessage = async (message, receiver) => {
  const update = message.body
  try {
    console.log(`Customer update received: vendor: ${message.vendor}, sbi: ${message.sbi}, frn: ${message.frn}`)
    if (
      !update?.frn ||
      (!update.vendor && !update.trader && !update.sbi)
    ) {
      throw new Error('Invalid customer update message')
    }
    await saveUpdate(update)
    console.log('Customer update processed')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error(`Unable to process payment request: sbi: ${message.sbi}, frn: ${message.frn}`)
    await sendCustomerUpdateFailureEvent(update, CUSTOMER_UPDATE_PROCESSING_FAILED, err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processCustomerMessage
}
