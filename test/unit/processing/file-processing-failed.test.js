const fileProcessingFailed = require('../../../app/processing/file-processing-failed')
const { DPS } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')
jest.mock('../../../app/processing/batch')
const batch = require('../../../app/processing/batch')
jest.mock('../../../app/processing/quarantine-file')
const quarantineFile = require('../../../app/processing/quarantine-file')

describe('File processing failed', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('Batch update status should have been called', async () => {
    await fileProcessingFailed(filename.DPS, DPS)
    expect(batch.updateStatus).toHaveBeenCalled()
  })

  test('Quarantine file should have been called', async () => {
    await fileProcessingFailed(filename.DPS, DPS)
    expect(quarantineFile).toHaveBeenCalled()
  })
})
