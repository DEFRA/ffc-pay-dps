
const reprocessIfNeeded = require('../../../app/processing/reprocess-if-needed')

jest.mock('../../../app/processing/batch')
const batch = require('../../../app/processing/batch')

jest.mock('../../../app/storage')
const blobStorage = require('../../../app/storage')

jest.mock('../../../app/config/processing')
const processingConfig = require('../../../app/config/processing')

jest.mock('../../../app/processing/file-processing-failed')
const fileProcessingFailed = require('../../../app/processing/file-processing-failed')

jest.mock('../../../app/processing/download-and-parse')
const downloadAndParse = require('../../../app/processing/download-and-parse')

jest.mock('../../../app/processing/quarantine-file')
const quarantineFile = require('../../../app/processing/quarantine-file')
const filename = require('../../mocks/filename')
const { DPS } = require('../../../app/constants/file-types')

global.console.log = jest.fn()

describe('Reprocess if needed', () => {
  let existingBatch

  processingConfig.maxProcessingTries = 1

  beforeEach(() => {
    existingBatch = {
      batchId: 1,
      filename,
      processingTries: 0,
      fileTypeId: 1,
      statusId: 1
    }
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('File does not already exist and re-process not required', async () => {
    batch.exists.mockResolvedValue(undefined)
    const response = await reprocessIfNeeded(filename, DPS)
    expect(response).toBe(false)
  })

  test('batch status is in progress with 0 processing tries and downloads and parses', async () => {
    batch.exists.mockResolvedValue(existingBatch)
    const response = await reprocessIfNeeded(filename, DPS)
    expect(response).toBe(true)
    expect(console.log).toHaveBeenLastCalledWith('Tried processing 0 times already')
    expect(downloadAndParse).toHaveBeenCalled()
    expect(batch.incrementProcessingTries).toHaveBeenCalled()
  })

  test('batch status is in progress with 1 processing tries', async () => {
    existingBatch.processingTries = 1
    batch.exists.mockResolvedValue(existingBatch)
    const response = await reprocessIfNeeded(filename, DPS)
    expect(response).toBe(true)
    expect(console.log).toHaveBeenLastCalledWith('Reached max re-tries, failed to process, quarantining')
    expect(fileProcessingFailed).toHaveBeenCalled()
  })

  test('batch status is success and is archived', async () => {
    existingBatch.statusId = 2
    batch.exists.mockResolvedValue(existingBatch)
    const response = await reprocessIfNeeded(filename, DPS)
    expect(response).toBe(true)
    expect(console.log).toHaveBeenLastCalledWith('Previous processing success status set, archiving')
    expect(blobStorage.archiveFile).toHaveBeenCalled()
  })

  test('batch status is failed and is quarantined', async () => {
    existingBatch.statusId = 3
    batch.exists.mockResolvedValue(existingBatch)
    const response = await reprocessIfNeeded(filename, DPS)
    expect(response).toBe(true)
    expect(console.log).toHaveBeenLastCalledWith('Previous processing failure status set, quarantining')
    expect(quarantineFile).toHaveBeenCalled()
  })

  test('batch status is unknown and and file processing is failed', async () => {
    existingBatch.statusId = 4
    batch.exists.mockResolvedValue(existingBatch)
    const response = await reprocessIfNeeded(filename, DPS)
    expect(response).toBe(true)
    expect(fileProcessingFailed).toHaveBeenCalled()
  })
})
