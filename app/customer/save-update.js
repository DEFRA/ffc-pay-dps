const db = require('../data')
const { TRADER } = require('../constants/reference-types')

const saveUpdate = async (customerUpdate) => {
  for (const referenceType in customerUpdate) {
    if ([TRADER].includes(referenceType)) {
      const existingCustomer = await db.customer.findOne({ where: { trader: customerUpdate[referenceType].toString() } })
      if (existingCustomer) {
        await db.customer.update({ frn: customerUpdate.frn }, { where: { id: existingCustomer.id } })
      } else {
        await db.customer.create({ trader: customerUpdate[referenceType], frn: customerUpdate.frn })
      }
    }
  }
}

module.exports = {
  saveUpdate
}
