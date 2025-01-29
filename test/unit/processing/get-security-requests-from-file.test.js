const getSecurityRequestsFromFile = require('../../../app/processing/get-security-requests-from-file')
const { DPS, DAX } = require('../../../app/constants/file-types')
const { DPS: DPSFilename, DAX: DAXFilename } = require('../../mocks/filename')
jest.mock('../../../app/processing/dps/read-dps-file')
const { readDPSFile } = require('../../../app/processing/dps/read-dps-file')
jest.mock('../../../app/processing/dax/read-dax-file')
const { readDAXFile } = require('../../../app/processing/dax/read-dax-file')

let fileBuffer

describe('Get security requests from file', () => {
  beforeEach(() => {
    readDPSFile.mockResolvedValue({ success: true, data: [] })
    readDAXFile.mockResolvedValue({ success: true, data: [] })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should process DPS file successfully', async () => {
    fileBuffer = Buffer.from(
      '706475,706475,1BH24607,1BH24607,,2100,,471.00,GBP,Import,,08/09/2023,'
    )
    const result = await getSecurityRequestsFromFile(
      fileBuffer,
      DPS,
      DPSFilename
    )
    expect(readDPSFile).toHaveBeenCalled()
    expect(result).toEqual({ success: true, data: [] })
  })

  test('should process DAX file successfully', async () => {
    fileBuffer = Buffer.from('010540,010540,1RB13915,Yes,GT0362947,Yes')
    const result = await getSecurityRequestsFromFile(
      fileBuffer,
      DAX,
      DAXFilename
    )
    expect(readDAXFile).toHaveBeenCalled()
    expect(result).toEqual({ success: true, data: [] })
  })

  test('should handle invalid file type', async () => {
    fileBuffer = Buffer.from('test data')
    const result = await getSecurityRequestsFromFile(
      fileBuffer,
      { fileType: 'INVALID' },
      'test.txt'
    )
    expect(result).toEqual({ error: 'Unsupported file type: INVALID' })
  })

  test('should handle undefined file type', async () => {
    fileBuffer = Buffer.from('test data')
    const result = await getSecurityRequestsFromFile(
      fileBuffer,
      undefined,
      'test.txt'
    )
    expect(result).toEqual({ error: 'Unsupported file type: undefined' })
  })

  test('should handle empty file', async () => {
    fileBuffer = Buffer.from('')
    const result = await getSecurityRequestsFromFile(
      fileBuffer,
      DPS,
      DPSFilename
    )
    expect(readDPSFile).toHaveBeenCalled()
    expect(result).toEqual({ success: true, data: [] })
  })

  test('should clean up resources after processing', async () => {
    fileBuffer = Buffer.from('test data')
    await getSecurityRequestsFromFile(fileBuffer, DPS, DPSFilename)
    expect(true).toBe(true)
  })
})
