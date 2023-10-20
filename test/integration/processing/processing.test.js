const path = require('path')
const { BlobServiceClient } = require('@azure/storage-blob')

const db = require('../../../app/data')
const { storageConfig } = require('../../../app/config')

const pollInbound = require('../../../app/polling/poll-inbound')

let blobServiceClient
let dpsContainer
let daxContainer

const TEST_FILE_DPS = 'BGAN20230908164539C.OUT'
const TEST_FILEPATH_DPS = path.resolve(__dirname, '../../files', TEST_FILE_DPS)

describe('process files', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })
    await db.fileType.bulkCreate([{
      fileTypeId: 1,
      fileType: 'DPS'
    }, {
      fileTypeId: 2,
      fileType: 'DAX'
    }])
    await db.status.bulkCreate([{
      statusId: 1,
      status: 'In progress'
    }, {
      statusId: 2,
      status: 'Success'
    }, {
      statusId: 3,
      status: 'Failed'
    }])

    blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
    dpsContainer = blobServiceClient.getContainerClient(storageConfig.dpsContainer)
    daxContainer = blobServiceClient.getContainerClient(storageConfig.daxContainer)
    await dpsContainer.deleteIfExists()
    await dpsContainer.createIfNotExists()
    await daxContainer.deleteIfExists()
    await daxContainer.createIfNotExists()
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('archives file on success for DPS', async () => {
    const blockBlobClient = dpsContainer.getBlockBlobClient(`${storageConfig.inboundFolder}/${TEST_FILE_DPS}`)
    await blockBlobClient.uploadFile(TEST_FILEPATH_DPS)

    await pollInbound()

    const fileList = []
    for await (const item of dpsContainer.listBlobsFlat({ prefix: storageConfig.archiveFolder })) {
      fileList.push(item.name)
    }
    expect(fileList.filter(x => x === `${storageConfig.archiveFolder}/${TEST_FILE_DPS}`).length).toBe(1)
  })

  test('ignores unrelated file', async () => {
    const blockBlobClient = dpsContainer.getBlockBlobClient(`${storageConfig.inbound}/ignore me.dat`)
    await blockBlobClient.uploadFile(TEST_FILEPATH_DPS)

    await pollInbound()

    const fileList = []
    for await (const item of dpsContainer.listBlobsFlat()) {
      fileList.push(item.name)
    }
    expect(fileList.filter(x => x === `${storageConfig.inbound}/ignore me.dat`).length).toBe(1)
  })
})
