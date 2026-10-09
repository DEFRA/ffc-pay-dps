jest.mock('../../../app/messaging/service-bus', () => ({
  getSender: jest.fn(),
  sendMessage: jest.fn()
}))

jest.mock('../../../app/config/messaging', () => ({
  submitTopic: { address: 'test-submit-topic' }
}))

jest.mock('../../../app/processing/get-new-filename', () => ({
  getNewFileName: jest.fn()
}))

const { getSender, sendMessage: sendServiceBusMessage } = require('../../../app/messaging/service-bus')
const { submitTopic } = require('../../../app/config/messaging')
const { getNewFileName } = require('../../../app/processing/get-new-filename')
const createSubmissionMessage = require('../../../app/messaging/create-submission-message')
const { sendSubmissionMessage } = require('../../../app/messaging/send-submission-message')

describe('send submission message', () => {
  let sender

  beforeEach(() => {
    jest.clearAllMocks()
    sender = { sendMessages: jest.fn() }
    getSender.mockReturnValue(sender)
    getNewFileName.mockReturnValue('FFC_BGAN20171101114636.csv')
  })

  test('renames file, creates sender for submit topic and sends message', async () => {
    const filename = 'BGAN20171101114636D.ack'
    const fileType = { fileType: 'DPS' }

    await sendSubmissionMessage(filename, fileType)

    expect(getNewFileName).toHaveBeenCalledWith(filename, fileType)
    expect(getSender).toHaveBeenCalledWith(submitTopic)
    expect(sendServiceBusMessage).toHaveBeenCalledWith(
      sender,
      createSubmissionMessage('FFC_BGAN20171101114636.csv', fileType)
    )
  })
})
