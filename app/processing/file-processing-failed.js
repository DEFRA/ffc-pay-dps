const batch = require('./batch')
const quarantineFile = require('./quarantine-file')

const fileProcessingFailed = async (filename, fileType) => {
  await batch.updateStatus(filename, batch.status.failed)
  await quarantineFile(filename, fileType)
}

module.exports = fileProcessingFailed
