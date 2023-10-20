const getFRN = require('../get-frn')

const addFields = async (paymentRequests) => {
  for (const paymentRequest of paymentRequests) {
    paymentRequest.primaryFRN = await getFRN(paymentRequest.primaryTrader)
    paymentRequest.usedByFRN = await getFRN(paymentRequest.usedByTrader)
  }
  return paymentRequests
}

module.exports = {
  addFields
}
