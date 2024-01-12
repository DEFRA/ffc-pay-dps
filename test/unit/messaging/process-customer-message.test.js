jest.mock('../../../app/customer')
const { saveUpdate: mockSaveUpdate } = require('../../../app/customer')

const { FRN } = require('../../../test/mocks/frn')

const { processCustomerMessage } = require('../../../app/messaging/process-customer-message')

let receiver

describe('process payment message', () => {
  beforeEach(() => {
    receiver = {
      completeMessage: jest.fn()
    }
  })

  test('completes valid message', async () => {
    const message = {
      body: {
        frn: FRN
      }
    }
    await processCustomerMessage(message, receiver)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
  })

  test('saves update if valid', async () => {
    const message = {
      body: {
        frn: FRN
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
        frn: FRN
      }
    }
    await processCustomerMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })
})
