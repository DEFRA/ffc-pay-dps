const { DPS } = require('../constants/file-types')
const { addFields: addDPSFields } = require('./dps/add-fields')
const getPaymentRequestsFromFile = require('./get-payment-requests-from-file')
const { publish: publishDPS } = require('./publish')

const parsePaymentFile = async (filename, fileBuffer, fileType) => {
  try {
    let { paymentRequests } = await getPaymentRequestsFromFile(fileBuffer, fileType, filename)
    if (fileType === DPS) {
      paymentRequests = await addDPSFields(paymentRequests)
    }
    await sendParsedPaymentRequests(paymentRequests, filename, fileType)
    return true
  } catch {
    return false
  }
}

const sendParsedPaymentRequests = async (paymentRequests, filename, fileType) => {
  try {
    if (fileType === DPS) {
      await publishDPS(paymentRequests, filename, fileType)
    } else {
      console.log('DAX flow not yet implemented')
    }
    console.log('Events not yet implemented')
  } catch (err) {
    console.error(`One or more payment requests could not be sent: ${err}`)
  }
  return true
}

module.exports = parsePaymentFile
