const processIfValid = require('../../../app/processing/process-if-valid')
jest.mock('../../../app/processing/batch')
const batch = require('../../../app/processing/batch')
const filename = require('../../mocks/filename')
const { DPS, DAX } = require('../../../app/constants/file-types')
jest.mock('../../../app/processing/download-and-parse')
const downloadAndParse = require('../../../app/processing/download-and-parse')

describe('Process if valid', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('batch has been created for DPS file', async () => {
    await processIfValid(filename, DPS)
    expect(downloadAndParse).toHaveBeenCalled()
    expect(batch.create).toHaveBeenCalled()
  })

  test('batch has been created for DAX file', async () => {
    await processIfValid(filename, DAX)
    expect(downloadAndParse).toHaveBeenCalled()
    expect(batch.create).toHaveBeenCalled()
  })
})
