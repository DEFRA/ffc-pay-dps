jest.mock('../../../app/processing/get-payment-requests-from-file')
const getPaymentRequestsFromFile = require('../../../app/processing/get-payment-requests-from-file')

const parsePaymentFile = require('../../../app/processing/parse-payment-file')
const { DPS } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

let fileBuffer

let paymentRequest
let paymentRequests

let paymentRequestsCollection

describe('Parse and send events on success or failure', () => {
  beforeEach(async () => {
    fileBuffer = Buffer.from('706475,706475,1BH24607,1BH24607,,2100,,471.00,GBP,Import,,08/09/2023,\r\n766951,766951,1PC09913,1PC09913,,2410,,14618.00,GBP,Import,,08/09/2023,\r\n015556,015556,1SA00002,1SA00002,,1100,,45030.00,GBP,Import,,07/09/2023,\r\n')

    paymentRequest = {
      paymentRequestId: 1
    }

    paymentRequests = [paymentRequest]

    paymentRequestsCollection = { paymentRequests }

    getPaymentRequestsFromFile.mockResolvedValue({
      paymentRequestsCollection
    })
  })

  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call getPaymentRequestsFromFile when valid filename, fileBuffer and file type are received', async () => {
    await parsePaymentFile(filename, fileBuffer, DPS)
    expect(getPaymentRequestsFromFile).toHaveBeenCalled()
  })

  test('should call getPaymentRequestsFromFile once when valid filename, fileBuffer file type are received', async () => {
    await parsePaymentFile(filename, fileBuffer, DPS)
    expect(getPaymentRequestsFromFile).toHaveBeenCalledTimes(1)
  })

  test('should call getPaymentRequestsFromFile with fileBuffer when valid filename, fileBuffer file type are received', async () => {
    await parsePaymentFile(filename, fileBuffer, DPS)
    expect(getPaymentRequestsFromFile).toHaveBeenCalledWith(fileBuffer, DPS, filename)
  })

  test('should call getPaymentRequestsFromFile when invalid filename, fileBuffer and file type are received', async () => {
    fileBuffer = ''

    await parsePaymentFile('', fileBuffer, DPS)

    expect(getPaymentRequestsFromFile).toHaveBeenCalled()
  })

  test('should call getPaymentRequestsFromFile once when invalid filename, fileBuffer and file type are received', async () => {
    fileBuffer = ''

    await parsePaymentFile('', fileBuffer, DPS)

    expect(getPaymentRequestsFromFile).toHaveBeenCalledTimes(1)
  })
})
