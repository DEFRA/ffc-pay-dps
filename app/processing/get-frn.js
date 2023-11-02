const db = require('../data')

const getFRN = async (traderId) => {
  // if length is 10 chars - this is already the FRN we want
  if (traderId.length === 10) {
    return traderId
  }
  const matchedEntry = await db.customer.findOne({
    where: { traderId },
    raw: true
  })
  if (matchedEntry === null) {
    return 'TL UNKNOWN'
  }
  return matchedEntry.frn
}

module.exports = getFRN
