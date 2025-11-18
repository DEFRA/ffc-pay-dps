const db = require('../../../../app/data')
const { addFields } = require('../../../../app/processing/dps/add-fields')
const dpsSecurityRequestLine = require('../../../mocks/dps-security-request-line')
const primaryTrader = require('../../../mocks/primary-trader')
const usedByTrader = require('../../../mocks/used-by-trader')

const securityRequests = [
  dpsSecurityRequestLine,
  { ...dpsSecurityRequestLine, primaryTrader: '12345678', usedByTrader: '98765432' },
  { ...dpsSecurityRequestLine, primaryTrader: '1234567890', usedByTrader: '9876543210' }
]

const primaryEntry = { customerId: 1, trader: primaryTrader, frn: '123456789' }
const usedByEntry = { customerId: 2, trader: usedByTrader, frn: '432156798' }

describe('addFields', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })
    await db.customer.bulkCreate([primaryEntry, usedByEntry])
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test.each([
    [0, 'primaryFRN', '123456789'],
    [1, 'primaryFRN', 'UNKNOWN'],
    [2, 'primaryFRN', securityRequests[2].primaryTrader],
    [0, 'usedByFRN', '432156798'],
    [1, 'usedByFRN', 'UNKNOWN'],
    [2, 'usedByFRN', securityRequests[2].usedByTrader]
  ])('sets %s for request at index %i', async (index, field, expected) => {
    const result = await addFields(securityRequests)
    expect(result[index][field]).toBe(expected)
  })
})
