const { DPS } = require('../constants/file-types')
const { sendSubmissionMessage } = require('../messaging')
const { addFields: addDPSFields } = require('./dps/add-fields')
const getSecurityRequestsFromFile = require('./get-security-requests-from-file')
const { publish: publishDPS } = require('./publish')

const parseSecurityFile = async (filename, fileBuffer, fileType) => {
  try {
    let { securityRequests } = await getSecurityRequestsFromFile(fileBuffer, fileType, filename)
    if (fileType === DPS) {
      securityRequests = await addDPSFields(securityRequests)
    }
    await sendParsedSecurityRequests(securityRequests, filename, fileType)
    return true
  } catch {
    return false
  }
}

const sendParsedSecurityRequests = async (securityRequests, filename, fileType) => {
  try {
    if (fileType === DPS) {
      await publishDPS(securityRequests, filename, fileType)
    } else {
      console.log('DAX flow not yet implemented')
    }
    await sendSubmissionMessage(securityRequests)
    console.log('Events not yet implemented')
  } catch (err) {
    console.error(`One or more security requests could not be sent: ${err}`)
  }
  return true
}

module.exports = parseSecurityFile
