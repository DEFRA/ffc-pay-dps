const util = require('util')
const { saveUpdate } = require('../customer')

const processCustomerMessage = async (message, receiver) => {
  const update = message.body
  try {
    console.log('Customer update received:', util.inspect(update, false, null, true))
    await saveUpdate(update)
    console.log('Customer update processed')
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process payment request:', util.inspect(err.message, false, null, true))
    await receiver.deadLetterMessage(message)
  }
}

module.exports = {
  processCustomerMessage
}
