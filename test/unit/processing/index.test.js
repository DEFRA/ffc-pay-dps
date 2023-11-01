const processSecurityFile = require('../../../app/processing')

jest.mock('../../../app/processing/batch')
const batch = require('../../../app/processing/batch')

jest.mock('../../../app/processing/download-and-parse')
const downloadAndParse = require('../../../app/processing/download-and-parse')
const { DPS, DAX } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

describe('Process security file', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should download and parse DPS file', async () => {
    await processSecurityFile(filename.DPS, DPS)
    expect(batch.create).toHaveBeenCalled()
    expect(downloadAndParse).toHaveBeenCalled()
  })

  test('should download and parse DAX file', async () => {
    await processSecurityFile(filename.DAX, DAX)
    expect(batch.create).toHaveBeenCalled()
    expect(downloadAndParse).toHaveBeenCalled()
  })
})
