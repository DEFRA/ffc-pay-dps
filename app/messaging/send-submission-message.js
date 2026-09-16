const { getSender, sendMessage: sendServiceBusMessage } = require('./service-bus')
const createSubmissionMessage = require('./create-submission-message')
const { submitTopic } = require('../config/messaging')
const { getNewFileName } = require('../processing/get-new-filename')

const sendSubmissionMessage = async (filename, fileType) => {
  filename = getNewFileName(filename, fileType)
  const sender = getSender(submitTopic)
  const message = createSubmissionMessage(filename, fileType)
  await sendServiceBusMessage(sender, message)
}

module.exports = {
  sendSubmissionMessage
}
