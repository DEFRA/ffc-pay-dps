const { MessageReceiver } = require('ffc-messaging')
const { messagingConfig } = require('../config')
const { processCustomerMessage } = require('./process-customer-message')
let customerReceiver

const start = async () => {
  const customerAction = message => processCustomerMessage(message, customerReceiver)
  customerReceiver = new MessageReceiver(messagingConfig.customerSubscription, customerAction)
  await customerReceiver.subscribe()
  console.info('Ready to receive customer requests')
}

const stop = async () => {
  await customerReceiver.closeConnection()
}

module.exports = { start, stop }
