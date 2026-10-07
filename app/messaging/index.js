const { messagingConfig } = require('../config')
const { createServiceBusClient, createReceiver, subscribeReceiver, closeSenders } = require('./service-bus')
const { processCustomerMessage } = require('./process-customer-message')
const errorHandler = (err) => console.error('Error receiving message:', err)

let sbClient
let customerReceiver

const start = async () => {
  sbClient = createServiceBusClient(messagingConfig.customerSubscription)
  customerReceiver = createReceiver(sbClient, messagingConfig.customerSubscription)

  subscribeReceiver(customerReceiver, processCustomerMessage, errorHandler, messagingConfig.customerSubscription)
  console.info('Ready to receive customer requests')
}

const stop = async () => {
  if (sbClient) {
    try {
      await sbClient.close()
    } catch (err) {
      console.error('Error closing Service Bus client:', err)
    }
    sbClient = null
  }
  await closeSenders()
}

module.exports = { start, stop }
