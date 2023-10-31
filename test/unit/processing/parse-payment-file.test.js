jest.mock('../../../app/processing/get-security-requests-from-file')
const getSecurityRequestsFromFile = require('../../../app/processing/get-security-requests-from-file')

const parseSecurityFile = require('../../../app/processing/parse-security-file')
const { DPS } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

let fileBuffer

let securityRequest
let securityRequests

let securityRequestsCollection

describe('Parse and send events on success or failure', () => {
  beforeEach(async () => {
    fileBuffer = Buffer.from('706475,706475,1BH24607,1BH24607,,2100,,471.00,GBP,Import,,08/09/2023,\r\n766951,766951,1PC09913,1PC09913,,2410,,14618.00,GBP,Import,,08/09/2023,\r\n015556,015556,1SA00002,1SA00002,,1100,,45030.00,GBP,Import,,07/09/2023,\r\n')

    securityRequest = {
      securityRequestId: 1
    }

    securityRequests = [securityRequest]

    securityRequestsCollection = { securityRequests }

    getSecurityRequestsFromFile.mockResolvedValue({
      securityRequestsCollection
    })
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call getSecurityRequestsFromFile when valid filename, fileBuffer and file type are received', async () => {
    await parseSecurityFile(filename, fileBuffer, DPS)
    expect(getSecurityRequestsFromFile).toHaveBeenCalled()
  })

  test('should call getSecurityRequestsFromFile once when valid filename, fileBuffer file type are received', async () => {
    await parseSecurityFile(filename, fileBuffer, DPS)
    expect(getSecurityRequestsFromFile).toHaveBeenCalledTimes(1)
  })

  test('should call getSecurityRequestsFromFile with fileBuffer when valid filename, fileBuffer file type are received', async () => {
    await parseSecurityFile(filename, fileBuffer, DPS)
    expect(getSecurityRequestsFromFile).toHaveBeenCalledWith(fileBuffer, DPS, filename)
  })

  test('should call getSecurityRequestsFromFile when invalid filename, fileBuffer and file type are received', async () => {
    fileBuffer = ''

    await parseSecurityFile('', fileBuffer, DPS)

    expect(getSecurityRequestsFromFile).toHaveBeenCalled()
  })

  test('should call getSecurityRequestsFromFile once when invalid filename, fileBuffer and file type are received', async () => {
    fileBuffer = ''

    await parseSecurityFile('', fileBuffer, DPS)

    expect(getSecurityRequestsFromFile).toHaveBeenCalledTimes(1)
  })
})
