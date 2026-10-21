const { createKnexMock, createQueryBuilder } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['customers'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { saveUpdate } = require('../../../app/customer/save-update')

const trader = 123456789
const frn = 1234567890

describe('saveUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.tables.customers.mockImplementation(() => mockDb.builder)
    mockDb.builder.resolves(undefined)
  })

  test('looks up the customer by trader as a string', async () => {
    await saveUpdate({ trader, frn })

    expect(mockDb.builder.where).toHaveBeenCalledWith({ trader: '123456789' })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })

  test('inserts a new customer when none exists for the trader', async () => {
    await saveUpdate({ trader, frn })

    expect(mockDb.builder.insert).toHaveBeenCalledWith({ trader, frn })
    expect(mockDb.builder.update).not.toHaveBeenCalled()
  })

  test('updates the frn of the existing customer', async () => {
    const lookup = createQueryBuilder().resolves({ customerId: 7, trader: '123456789', frn: '1' })
    const write = createQueryBuilder().resolves()
    mockDb.tables.customers.mockReturnValueOnce(lookup).mockReturnValueOnce(write)

    await saveUpdate({ trader, frn })

    expect(write.where).toHaveBeenCalledWith({ customerId: 7 })
    expect(write.update).toHaveBeenCalledWith({ frn })
    expect(write.insert).not.toHaveBeenCalled()
  })

  test('does nothing when the update has no trader', async () => {
    await saveUpdate({ frn })

    expect(mockDb.tables.customers).not.toHaveBeenCalled()
  })

  test('propagates a failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))
    await expect(saveUpdate({ trader, frn })).rejects.toThrow('DB error')
  })
})
