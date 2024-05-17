const sendBatchErrorEvent = require('../../../app/event/send-batch-error-event')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { processingConfig, messagingConfig } = require('../../../app/config')
const { SOURCE } = require('../../../app/constants/source')
const { BATCH_REJECTED } = require('../../../app/constants/events')

jest.mock('ffc-pay-event-publisher')
jest.mock('../../../app/config')

describe('sendBatchErrorEvent', () => {
  test('publishes an event when useEvents is true', async () => {
    processingConfig.useEvents = true
    const filename = 'testfile'
    const error = new Error('test error')

    await sendBatchErrorEvent(filename, error)

    expect(EventPublisher).toHaveBeenCalledWith(messagingConfig.eventsTopic)
    expect(EventPublisher.prototype.publishEvent).toHaveBeenCalledWith({
      source: SOURCE,
      type: BATCH_REJECTED,
      subject: filename,
      data: {
        message: error.message,
        filename
      }
    })
  })
})
