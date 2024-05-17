const sendBatchSuccessEvent = require('../../../app/event/send-batch-success-event')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { processingConfig, messagingConfig } = require('../../../app/config')
const { SOURCE } = require('../../../app/constants/source')
const { BATCH_PROCESSED } = require('../../../app/constants/events')

jest.mock('ffc-pay-event-publisher')
jest.mock('../../../app/config')

describe('sendBatchSuccessEvent', () => {
  test('publishes an event when useEvents is true', async () => {
    processingConfig.useEvents = true
    const filename = 'testfile'

    await sendBatchSuccessEvent(filename)

    expect(EventPublisher).toHaveBeenCalledWith(messagingConfig.eventsTopic)
    expect(EventPublisher.prototype.publishEvent).toHaveBeenCalledWith({
      source: SOURCE,
      type: BATCH_PROCESSED,
      subject: filename,
      data: {
        filename
      }
    })
  })
})
