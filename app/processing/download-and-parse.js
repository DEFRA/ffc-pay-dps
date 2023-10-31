const storage = require('../storage')
const parseSecurityFile = require('./parse-security-file')
const fileProcessingFailed = require('./file-processing-failed')
const batch = require('./batch')

const downloadAndParse = async (filename, fileType) => {
  const buffer = await storage.getFile(filename, fileType)
  const parseSuccess = await parseSecurityFile(filename, buffer, fileType)

  if (parseSuccess) {
    console.log(`Archiving ${filename}, successfully parsed file`)
    await batch.updateStatus(filename, batch.status.success)
    await storage.archiveFile(filename, fileType)
  } else {
    console.log(`Quarantining ${filename}, failed to parse file`)
    await fileProcessingFailed(filename, fileType)
  }
}

module.exports = downloadAndParse
