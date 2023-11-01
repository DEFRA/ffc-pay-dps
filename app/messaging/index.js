const { MessageSender, MessageBatchSender } = require('ffc-messaging')
const createSubmissionMessage = require('./create-submission-message')
const createReturnMessage = require('./create-return-message')
const { submitTopic, returnTopic } = require('../config/messaging')
const { getNewFileName } = require('../processing/get-new-filename')

const sendSubmissionMessage = async (filename, fileType) => {
  filename = getNewFileName(filename, fileType)
  const message = createSubmissionMessage(filename, fileType.fileType)
  const sender = new MessageSender(submitTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

const sendReturnMessage = async (content, filename) => {
  const messages = content.map(message => createReturnMessage(message, filename))
  const sender = new MessageBatchSender(returnTopic)
  await sender.sendBatchMessages(messages)
  await sender.closeConnection()
}

module.exports = {
  sendSubmissionMessage,
  sendReturnMessage
}
