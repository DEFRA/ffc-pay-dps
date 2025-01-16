const processSecurityFile = require('../../../app/processing')
const { sendBatchErrorEvent } = require('../../../app/event')

jest.mock('../../../app/processing/batch')
const batch = require('../../../app/processing/batch')

jest.mock('../../../app/processing/download-and-parse')
const downloadAndParse = require('../../../app/processing/download-and-parse')

jest.mock('../../../app/event')

const { DPS, DAX } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

describe('Process security file', () => {
  const consoleError = console.error

  beforeEach(() => {
    console.error = jest.fn()
  })

  afterEach(() => {
    console.error = consoleError
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

  test('should handle processing error', async () => {
    const error = new Error('Test error')
    downloadAndParse.mockRejectedValue(error)

    await processSecurityFile(filename.DPS, DPS)

    expect(sendBatchErrorEvent).toHaveBeenCalledWith(filename.DPS, error)
    expect(console.error).toHaveBeenNthCalledWith(
      1,
      `Error thrown processing ${filename.DPS}`
    )
    expect(console.error).toHaveBeenNthCalledWith(2, error)
  })
})
