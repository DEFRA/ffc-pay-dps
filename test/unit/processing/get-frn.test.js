const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['customers'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const getFRN = require('../../../app/processing/get-frn')

describe('getFRN', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(undefined)
  })

  test('returns the trader without querying when it is already an FRN', async () => {
    await expect(getFRN('1234567890')).resolves.toBe('1234567890')
    expect(mockDb.tables.customers).not.toHaveBeenCalled()
  })

  test('returns the FRN of the matching customer', async () => {
    mockDb.builder.resolves({ customerId: 1, trader: '123456789', frn: '1234567890' })

    await expect(getFRN('123456789')).resolves.toBe('1234567890')
    expect(mockDb.tables.customers).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ trader: '123456789' })
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })

  test('returns UNKNOWN when no customer matches', async () => {
    await expect(getFRN('123456789')).resolves.toBe('UNKNOWN')
  })

  test('propagates a failure', async () => {
    mockDb.builder.rejects(new Error('DB error'))
    await expect(getFRN('123456789')).rejects.toThrow('DB error')
  })
})
