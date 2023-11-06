const db = require('../data')

const getFRN = async (trader) => {
  // if length is 10 chars - this is already the FRN we want
  if (trader.length === 10) {
    return trader
  }
  const matchedEntry = await db.customer.findOne({
    where: { trader },
    raw: true
  })
  if (matchedEntry === null) {
    return 'UNKNOWN'
  }
  return matchedEntry.frn
}

module.exports = getFRN
