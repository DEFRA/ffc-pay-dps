const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')
const { sendTopic } = require('../config/messaging')

const sendSubmissionMessage = async (securityRequests) => {
  const message = createMessage(securityRequests)
  const sender = new MessageSender(sendTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendSubmissionMessage
}
