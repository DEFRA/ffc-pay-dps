jest.mock('../../../app/processing/get-security-requests-from-file')
const getSecurityRequestsFromFile = require('../../../app/processing/get-security-requests-from-file')

const parseSecurityFile = require('../../../app/processing/parse-security-file')
const { DPS } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

describe('parseSecurityFile', () => {
  let fileBuffer
  let securityRequest
  let securityRequests
  let securityRequestsCollection

  beforeEach(() => {
    fileBuffer = Buffer.from(
      '706475,706475,1BH24607,1BH24607,,2100,,471.00,GBP,Import,,08/09/2023,\r\n' +
      '766951,766951,1PC09913,1PC09913,,2410,,14618.00,GBP,Import,,08/09/2023,\r\n' +
      '015556,015556,1SA00002,1SA00002,,1100,,45030.00,GBP,Import,,07/09/2023,\r\n'
    )

    securityRequest = { securityRequestId: 1 }
    securityRequests = [securityRequest]
    securityRequestsCollection = { securityRequests }

    getSecurityRequestsFromFile.mockResolvedValue({ securityRequestsCollection })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test.each([
    ['valid filename', filename, fileBuffer],
    ['empty filename', '', Buffer.from('')]
  ])('should call getSecurityRequestsFromFile once for %s', async (_, testFilename, buffer) => {
    await parseSecurityFile(testFilename, buffer, DPS)
    expect(getSecurityRequestsFromFile).toHaveBeenCalledTimes(1)
    expect(getSecurityRequestsFromFile).toHaveBeenCalledWith(buffer, DPS, testFilename)
  })
})
