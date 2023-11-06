const getSecurityRequestsFromFile = require('../../../app/processing/get-security-requests-from-file')
const { DPS, DAX } = require('../../../app/constants/file-types')
const { DPS: DPSFilename, DAX: DAXFilename } = require('../../mocks/filename')
jest.mock('../../../app/processing/dps/read-dps-file')
const { readDPSFile } = require('../../../app/processing/dps/read-dps-file')
jest.mock('../../../app/processing/dax/read-dax-file')
const { readDAXFile } = require('../../../app/processing/dax/read-dax-file')

let fileBuffer

describe('Get security requests from file', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('readDPSFile has been called for DPS input', async () => {
    fileBuffer = Buffer.from('706475,706475,1BH24607,1BH24607,,2100,,471.00,GBP,Import,,08/09/2023,\r\n766951,766951,1PC09913,1PC09913,,2410,,14618.00,GBP,Import,,08/09/2023,\r\n015556,015556,1SA00002,1SA00002,,1100,,45030.00,GBP,Import,,07/09/2023,\r\n')
    await getSecurityRequestsFromFile(fileBuffer, DPS, DPSFilename)
    expect(readDPSFile).toHaveBeenCalled()
  })

  test('readDAXFile has been called for DAX input', async () => {
    fileBuffer = Buffer.from('010540,010540,1RB13915,Yes,GT0362947,Yes\r\n')
    await getSecurityRequestsFromFile(fileBuffer, DAX, DAXFilename)
    expect(readDAXFile).toHaveBeenCalled()
  })
})
