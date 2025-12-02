jest.mock('../../../app/config/processing', () => ({
  useEvents: true
}))

jest.mock('../../../app/config/messaging', () => ({
  eventsTopic: 'test-events-topic'
}))

jest.mock('ffc-pay-event-publisher', () => ({
  EventPublisher: jest.fn().mockImplementation(() => ({
    publishEvent: jest.fn()
  }))
}))

const config = require('../../../app/config/processing')
const { EventPublisher } = require('ffc-pay-event-publisher')
const sendCustomerUpdateFailureEvent = require('../../../app/event/send-customer-update-failure-event')

describe('sendCustomerUpdateFailureEvent', () => {
  let mockPublishEvent
  let mockEventPublisher

  beforeEach(() => {
    jest.clearAllMocks()
    mockPublishEvent = jest.fn()
    mockEventPublisher = {
      publishEvent: mockPublishEvent
    }
    EventPublisher.mockImplementation(() => mockEventPublisher)
  })

  test('publishes event when useEvents is true', async () => {
    const data = { customerId: '123', orderId: 'ORD-456' }
    const type = 'customer-update-failed'
    const error = 'Update failed due to validation error'

    await sendCustomerUpdateFailureEvent(data, type, error)

    expect(EventPublisher).toHaveBeenCalledWith('test-events-topic')
    expect(mockPublishEvent).toHaveBeenCalledWith({
      source: 'ffc-pay-dps',
      type: 'customer-update-failed',
      subject: 'Customer Update Failure',
      data: {
        message: 'Update failed due to validation error',
        customerId: '123',
        orderId: 'ORD-456'
      }
    })
  })

  test('does not publish event when useEvents is false', async () => {
    config.useEvents = false
    const data = { customerId: '123' }
    const type = 'customer-update-failed'
    const error = 'Update failed'

    await sendCustomerUpdateFailureEvent(data, type, error)

    expect(EventPublisher).not.toHaveBeenCalled()
    expect(mockPublishEvent).not.toHaveBeenCalled()
  })

  test('includes all data properties in event', async () => {
    config.useEvents = true
    const data = {
      customerId: '123',
      orderId: 'ORD-456',
      amount: 100,
      reference: 'REF-789'
    }
    const type = 'customer-update-failed'
    const error = 'Timeout error'

    await sendCustomerUpdateFailureEvent(data, type, error)

    expect(mockPublishEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          customerId: '123',
          orderId: 'ORD-456',
          amount: 100,
          reference: 'REF-789',
          message: 'Timeout error'
        })
      })
    )
  })
})
