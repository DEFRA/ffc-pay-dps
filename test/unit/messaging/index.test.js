const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['customers'])

jest.mock('@azure/service-bus', () => ({
  ServiceBusClient: jest.fn(),
  ServiceBusAdministrationClient: jest.fn()
}))

jest.mock('@azure/identity')
jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { ServiceBusClient } = require('@azure/service-bus')
const { messagingConfig } = require('../../../app/config')
const messageService = require('../../../app/messaging')

describe('messaging', () => {
  let mockReceiver
  let mockClient

  beforeEach(() => {
    jest.clearAllMocks()

    mockReceiver = {
      subscribe: jest.fn()
    }

    mockClient = {
      createReceiver: jest.fn().mockReturnValue(mockReceiver),
      createSender: jest.fn().mockReturnValue({ close: jest.fn() }),
      close: jest.fn().mockResolvedValue()
    }

    ServiceBusClient.mockImplementation(() => mockClient)
  })

  afterEach(async () => {
    await messageService.stop()
  })

  test('starts customer subscription', async () => {
    await messageService.start()

    expect(ServiceBusClient).toHaveBeenCalled()
    expect(mockClient.createReceiver).toHaveBeenCalledWith(
      messagingConfig.customerSubscription.topic,
      messagingConfig.customerSubscription.address
    )
    expect(mockReceiver.subscribe).toHaveBeenCalled()
  })

  test('stops and closes service bus client', async () => {
    await messageService.start()
    await messageService.stop()

    expect(mockClient.close).toHaveBeenCalled()
  })

  test('logs error when closing service bus client fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    const closeError = new Error('close failed')
    mockClient.close.mockRejectedValue(closeError)

    await messageService.start()
    await messageService.stop()

    expect(consoleSpy).toHaveBeenCalledWith('Error closing Service Bus client:', closeError)
    consoleSpy.mockRestore()
  })
})
