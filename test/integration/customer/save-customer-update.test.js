const { FRN } = require('../../mocks/frn')
const { TRADER } = require('../../mocks/trader')

const db = require('../../../app/data')

const { saveUpdate } = require('../../../app/customer')

let customerUpdate

describe('save customer update', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })

    customerUpdate = {
      trader: TRADER,
      frn: FRN
    }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should save update for customer with trader', async () => {
    await saveUpdate(customerUpdate)
    const result = await db.customer.findAll({ where: { trader: TRADER, frn: FRN } })
    expect(result).toHaveLength(1)
  })

  test('should update frn for existing customer with trader', async () => {
    await db.customer.create({ trader: TRADER, frn: 123 })
    await saveUpdate(customerUpdate)
    const result = await db.customer.findAll({ trader: { reference: TRADER, frn: FRN } })
    expect(result).toHaveLength(1)
  })

  test('should not save update for customer without trader', async () => {
    delete customerUpdate.trader
    await saveUpdate(customerUpdate)
    const result = await db.customer.findAll()
    expect(result).toHaveLength(0)
  })
})
