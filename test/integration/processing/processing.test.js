const path = require('path')
const { BlobServiceClient } = require('@azure/storage-blob')

const db = require('../../../app/data')
const { storageConfig } = require('../../../app/config')
const pollInbound = require('../../../app/polling/poll-inbound')

const TEST_FILE_DPS = 'BGAN20230908164539C.OUT'
const TEST_FILEPATH_DPS = path.resolve(__dirname, '../../files', TEST_FILE_DPS)

describe('process files', () => {
  let blobServiceClient
  let dpsContainer
  let daxContainer

  beforeEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })

    await db.fileType.bulkCreate([{ fileTypeId: 1, fileType: 'DPS' }, { fileTypeId: 2, fileType: 'DAX' }])
    await db.status.bulkCreate([{ statusId: 1, status: 'In progress' }, { statusId: 2, status: 'Success' }, { statusId: 3, status: 'Failed' }])

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

  const listBlobs = async (container, prefix = '') => {
    const files = []
    for await (const item of container.listBlobsFlat({ prefix })) {
      files.push(item.name)
    }
    return files
  }

  test('archives DPS file on success', async () => {
    const blockBlob = dpsContainer.getBlockBlobClient(`${storageConfig.inboundFolder}/${TEST_FILE_DPS}`)
    await blockBlob.uploadFile(TEST_FILEPATH_DPS)

    await pollInbound()

    const archivedFiles = await listBlobs(dpsContainer, storageConfig.archiveFolder)
    expect(archivedFiles).toContain(`${storageConfig.archiveFolder}/${TEST_FILE_DPS}`)
  })

  test('does not process unrelated file', async () => {
    const testFile = 'ignore me.dat'
    const blockBlob = dpsContainer.getBlockBlobClient(`${storageConfig.inbound}/${testFile}`)
    await blockBlob.uploadFile(TEST_FILEPATH_DPS)

    await pollInbound()

    const allFiles = await listBlobs(dpsContainer)
    expect(allFiles).toContain(`${storageConfig.inbound}/${testFile}`)
  })
})
