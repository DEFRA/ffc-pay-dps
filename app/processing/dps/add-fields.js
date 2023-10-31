const getFRN = require('../get-frn')

const addFields = async (securityRequests) => {
  for (const securityRequest of securityRequests) {
    securityRequest.primaryFRN = await getFRN(securityRequest.primaryTrader)
    securityRequest.usedByFRN = await getFRN(securityRequest.usedByTrader)
  }
  return securityRequests
}

module.exports = {
  addFields
}
