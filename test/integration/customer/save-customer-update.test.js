const { FRN } = require('../../mocks/frn')
const { TRADER } = require('../../mocks/trader')
const db = require('../../../app/database')
const { truncate } = require('../../helpers/truncate')
const { saveUpdate } = require('../../../app/customer')

describe('save customer update', () => {
  let customerUpdate

  beforeEach(async () => {
    await truncate()
    customerUpdate = { trader: TRADER, frn: FRN }
  })

  afterAll(async () => {
    await truncate()
    await db.close()
  })

  test('saves update for customer with trader', async () => {
    await saveUpdate(customerUpdate)
    const customers = await db.customers().where({ trader: TRADER, frn: FRN })
    expect(customers).toHaveLength(1)
  })

  test('updates frn for existing customer with trader', async () => {
    await db.customers().insert({ trader: TRADER, frn: 123 })
    await saveUpdate(customerUpdate)
    const customers = await db.customers().where({ trader: TRADER, frn: FRN })
    expect(customers).toHaveLength(1)
  })

  test('does not save update for customer without trader', async () => {
    delete customerUpdate.trader
    await saveUpdate(customerUpdate)
    const customers = await db.customers()
    expect(customers).toHaveLength(0)
  })
})
