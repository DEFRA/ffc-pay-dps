const { sendBatchQuarantineEvent } = require('../event')
const storage = require('../storage')

const quarantineFile = async (filename) => {
  await sendBatchQuarantineEvent(filename)
  return storage.quarantineFile(filename)
}

module.exports = quarantineFile
