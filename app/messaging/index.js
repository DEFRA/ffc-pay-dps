const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')
const { sendTopic } = require('../config/messaging')
const { getNewFileName } = require('../processing/get-new-filename')

const sendSubmissionMessage = async (filename, fileType) => {
  filename = getNewFileName(filename, fileType)
  const message = createMessage(filename, fileType.fileType)
  const sender = new MessageSender(sendTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendSubmissionMessage
}
