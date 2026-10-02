const getFRN = require('../get-frn')

const addFields = async (securityRequests) => {
  for (const securityRequest of securityRequests) {
    await addFRNs(securityRequest) // NOSONAR
  }
  return securityRequests
}

const addFRNs = async (securityRequest) => {
  securityRequest.primaryFRN = await getFRN(securityRequest.primaryTrader)
  securityRequest.usedByFRN = await getFRN(securityRequest.usedByTrader)
}

module.exports = {
  addFields
}
