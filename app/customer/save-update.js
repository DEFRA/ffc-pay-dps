const { customers } = require('../database')
const { TRADER } = require('../constants/reference-types')

const saveUpdate = async (customerUpdate) => {
  for (const referenceType of Object.keys(customerUpdate)) {
    await saveReference(customerUpdate, referenceType) // NOSONAR
  }
}

const saveReference = async (customerUpdate, referenceType) => {
  if ([TRADER].includes(referenceType)) {
    const existingCustomer = (await customers().where({ trader: customerUpdate[referenceType].toString() }).first()) ?? null
    if (existingCustomer) {
      await customers().where({ customerId: existingCustomer.customerId }).update({ frn: customerUpdate.frn })
    } else {
      await customers().insert({ trader: customerUpdate[referenceType], frn: customerUpdate.frn })
    }
  }
}

module.exports = {
  saveUpdate
}
