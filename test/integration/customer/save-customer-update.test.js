const { FRN } = require('../../mocks/frn')
const { TRADER } = require('../../mocks/trader')
const db = require('../../../app/data')
const { saveUpdate } = require('../../../app/customer')

describe('save customer update', () => {
  let customerUpdate

  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
    customerUpdate = { trader: TRADER, frn: FRN }
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('saves update for customer with trader', async () => {
    await saveUpdate(customerUpdate)
    const customers = await db.customer.findAll({ where: { trader: TRADER, frn: FRN } })
    expect(customers).toHaveLength(1)
  })

  test('updates frn for existing customer with trader', async () => {
    await db.customer.create({ trader: TRADER, frn: 123 })
    await saveUpdate(customerUpdate)
    const customers = await db.customer.findAll({ where: { trader: TRADER, frn: FRN } })
    expect(customers).toHaveLength(1)
  })

  test('does not save update for customer without trader', async () => {
    delete customerUpdate.trader
    await saveUpdate(customerUpdate)
    const customers = await db.customer.findAll()
    expect(customers).toHaveLength(0)
  })
})
