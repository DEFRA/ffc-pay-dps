const { customers } = require('../database')
const { TRADER } = require('../constants/reference-types')

const saveUpdate = async (customerUpdate) => {
  if (TRADER in customerUpdate) {
    const existingCustomer = (await customers().where({ trader: customerUpdate[TRADER].toString() }).first()) ?? null
    if (existingCustomer) {
      await customers().where({ customerId: existingCustomer.customerId }).update({ frn: customerUpdate.frn })
    } else {
      await customers().insert({ trader: customerUpdate[TRADER], frn: customerUpdate.frn })
    }
  }
}

module.exports = {
  saveUpdate
}
