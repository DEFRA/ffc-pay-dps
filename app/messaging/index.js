const { MessageSender, MessageBatchSender } = require('ffc-messaging')
const createSubmissionMessage = require('./create-submission-message')
const createReturnMessage = require('./create-return-message')
const { submitTopic } = require('../config/messaging')
const { getNewFileName } = require('../processing/get-new-filename')

const sendSubmissionMessage = async (filename, fileType) => {
  filename = getNewFileName(filename, fileType)
  const message = createSubmissionMessage(filename, fileType.fileType)
  const sender = new MessageSender(submitTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = {
  sendSubmissionMessage
}
