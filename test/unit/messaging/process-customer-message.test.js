jest.mock('../../../app/customer')
const { saveUpdate: mockSaveUpdate } = require('../../../app/customer')

const { FRN } = require('../../../test/mocks/frn')

const { processCustomerMessage } = require('../../../app/messaging/process-customer-message')

jest.mock('../../../app/event')

let receiver

describe('process payment message', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }
  })

  test('completes valid message', async () => {
    const message = {
      body: {
        frn: FRN,
        vendor: 'TEST_VENDOR'
      }
    }

    await processCustomerMessage(message, receiver)

    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('saves update if valid', async () => {
    const message = {
      body: {
        frn: FRN,
        vendor: 'TEST_VENDOR'
      }
    }

    await processCustomerMessage(message, receiver)

    expect(mockSaveUpdate).toHaveBeenCalledWith(message.body)
  })

  test('does not complete if error', async () => {
    mockSaveUpdate.mockImplementation(() => {
      throw new Error()
    })

    const message = {
      body: {
        frn: FRN,
        vendor: 'TEST_VENDOR'
      }
    }

    await processCustomerMessage(message, receiver)

    expect(receiver.completeMessage).not.toHaveBeenCalled()
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })

  test('does not process message without vendor, trader or sbi', async () => {
    const message = {
      body: {
        frn: FRN
      }
    }

    await processCustomerMessage(message, receiver)

    expect(mockSaveUpdate).not.toHaveBeenCalled()
    expect(receiver.completeMessage).not.toHaveBeenCalled()
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })
})
