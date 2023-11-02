const db = require('../../../../app/data')

const { addFields } = require('../../../../app/processing/dps/add-fields')
const dpsSecurityRequestLine = require('../../../mocks/dps-security-request-line')
const primaryTrader = require('../../../mocks/primary-trader')
const usedByTrader = require('../../../mocks/used-by-trader')

const securityRequests = [dpsSecurityRequestLine, { ...dpsSecurityRequestLine, primaryTrader: '12345678', usedByTrader: '98765432' }, { ...dpsSecurityRequestLine, primaryTrader: '1234567890', usedByTrader: '9876543210' }]
const primaryEntry = {
  customerId: 1,
  traderId: primaryTrader,
  frn: '123456789'
}
const usedByEntry = {
  customerId: 2,
  traderId: usedByTrader,
  frn: '432156798'
}

describe('Add fields to DPS request', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })
    await db.customer.bulkCreate([primaryEntry, usedByEntry])
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('Correctly sets primaryFRN if entry is in DB', async () => {
    const result = await addFields(securityRequests)
    expect(result[0].primaryFRN).toBe('123456789')
  })

  test('Correctly sets primaryFRN as TL UNKNOWN if entry is not in DB', async () => {
    const result = await addFields(securityRequests)
    expect(result[1].primaryFRN).toBe('TL UNKNOWN')
  })

  test('Correctly sets usedByFRN if entry is in DB', async () => {
    const result = await addFields(securityRequests)
    expect(result[0].usedByFRN).toBe('432156798')
  })

  test('Correctly sets usedByFRN as TL UNKNOWN if entry is not in DB', async () => {
    const result = await addFields(securityRequests)
    expect(result[1].usedByFRN).toBe('TL UNKNOWN')
  })

  test('Correctly sets primaryFRN if primaryTrader is 10 chars', async () => {
    const result = await addFields(securityRequests)
    expect(result[2].primaryFRN).toBe(securityRequests[2].primaryTrader)
  })

  test('Correctly sets usedByFRN if usedByTrader is 10 chars', async () => {
    const result = await addFields(securityRequests)
    expect(result[2].usedByFRN).toBe(securityRequests[2].usedByTrader)
  })
})
