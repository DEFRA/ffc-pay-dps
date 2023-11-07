const processIfValid = require('./process-if-valid')
const reprocessIfNeeded = require('./reprocess-if-needed')
const { sendBatchErrorEvent } = require('../event')

const processFile = async (fileName, fileType) => {
  try {
    console.log(`Processing ${fileName} with type ${fileType.fileType}`)
    const reprocessed = await reprocessIfNeeded(fileName, fileType)
    if (!reprocessed) {
      await processIfValid(fileName, fileType)
    }
  } catch (err) {
    await sendBatchErrorEvent(fileName, err)
    console.error(`Error thrown processing ${fileName}`)
    console.error(err)
  }
}

module.exports = processFile
