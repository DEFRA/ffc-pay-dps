const util = require('util')
const { saveUpdate } = require('../customer')
const { sendCustomerUpdateFailureEvent } = require('../event')
const { CUSTOMER_UPDATE_PROCESSING_FAILED } = require('../constants/events')

const processCustomerMessage = async (message, receiver) => {
  const update = message.body
  try {
    console.log('Customer update received:', util.inspect(update, false, null, true))
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
    console.error('Unable to process payment request:', util.inspect(err.message, false, null, true))
    await sendCustomerUpdateFailureEvent(update, CUSTOMER_UPDATE_PROCESSING_FAILED, err)
    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processCustomerMessage
}
