const db = require('../data')

const getFRN = async (legacyId) => {
  // if length is 10 chars - this is already the FRN we want
  if (legacyId.length === 10) {
    return legacyId
  }
  const matchedEntry = await db.customer.findOne({
    where: { legacyId },
    raw: true
  })
  if (matchedEntry === null) {
    return 'TL UNKNOWN'
  }
  return matchedEntry.FRN
}

module.exports = getFRN
