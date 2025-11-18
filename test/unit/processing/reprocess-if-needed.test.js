const reprocessIfNeeded = require('../../../app/processing/reprocess-if-needed')
const { DPS } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

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

global.console.log = jest.fn()

describe('reprocessIfNeeded', () => {
  let existingBatch

  beforeEach(() => {
    jest.resetAllMocks()
    processingConfig.maxProcessingTries = 1

    existingBatch = {
      batchId: 1,
      filename,
      processingTries: 0,
      fileTypeId: 1,
      statusId: 1
    }
  })

  test('returns false if file does not exist', async () => {
    batch.exists.mockResolvedValue(undefined)
    const result = await reprocessIfNeeded(filename, DPS)
    expect(result).toBe(false)
  })

  test('reprocesses file if in progress with processingTries < max', async () => {
    batch.exists.mockResolvedValue(existingBatch)
    const result = await reprocessIfNeeded(filename, DPS)

    expect(result).toBe(true)
    expect(console.log).toHaveBeenLastCalledWith('Tried processing 0 times already')
    expect(downloadAndParse).toHaveBeenCalled()
    expect(batch.incrementProcessingTries).toHaveBeenCalled()
  })

  test('fails processing if in progress with processingTries >= max', async () => {
    existingBatch.processingTries = 1
    batch.exists.mockResolvedValue(existingBatch)
    const result = await reprocessIfNeeded(filename, DPS)

    expect(result).toBe(true)
    expect(console.log).toHaveBeenLastCalledWith('Reached max re-tries, failed to process, quarantining')
    expect(fileProcessingFailed).toHaveBeenCalled()
  })

  test.each([
    [2, 'Previous processing success status set, archiving', blobStorage.archiveFile],
    [3, 'Previous processing failure status set, quarantining', quarantineFile],
    [4, null, fileProcessingFailed]
  ])('handles batch status %i correctly', async (statusId, logMessage, mockFn) => {
    existingBatch.statusId = statusId
    batch.exists.mockResolvedValue(existingBatch)

    const result = await reprocessIfNeeded(filename, DPS)
    expect(result).toBe(true)

    if (logMessage) expect(console.log).toHaveBeenLastCalledWith(logMessage)
    expect(mockFn).toHaveBeenCalled()
  })
})
