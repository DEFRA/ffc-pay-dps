const batch = require('./batch')
const { processingConfig } = require('../config')
const storage = require('../storage')
const fileProcessingFailed = require('./file-processing-failed')
const downloadAndParse = require('./download-and-parse')
const quarantineFile = require('./quarantine-file')

const reprocessIfNeeded = async (filename, fileType) => {
  const existingBatch = await batch.exists(filename)

  if (existingBatch) {
    console.log(`${filename} already exists in database`)
    switch (existingBatch.statusId) {
      case batch.status.inProgress:
        await reprocess(filename, existingBatch, fileType)
        break
      case batch.status.success:
        await success(filename, fileType)
        break
      case batch.status.failed:
        await failed(filename, fileType)
        break
      default:
        await unknown(filename, fileType)
        break
    }
    return true
  }
  return false
}

const reprocess = async (filename, existingBatch, fileType) => {
  console.log('In progress status set, re-try processing')
  console.log(`Tried processing ${existingBatch.processingTries} times already`)

  if (existingBatch.processingTries >= processingConfig.maxProcessingTries) {
    console.log('Reached max re-tries, failed to process, quarantining')
    await fileProcessingFailed(filename, fileType)
  } else {
    await batch.incrementProcessingTries(filename)
    await downloadAndParse(filename, fileType)
  }
}

const success = async (filename, fileType) => {
  console.log('Previous processing success status set, archiving')
  await storage.archiveFile(filename, fileType)
}

const failed = async (filename, fileType) => {
  console.log('Previous processing failure status set, quarantining')
  await quarantineFile(filename, fileType)
}

const unknown = async (filename, fileType) => {
  console.log('Previous processing unknown status set, quarantining')
  await fileProcessingFailed(filename, fileType)
}

module.exports = reprocessIfNeeded
