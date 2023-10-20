const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('../../app/config')
const blobStorage = require('../../app/storage')
const { DPS, DAX } = require('../../app/constants/file-types')

const mockFileList = [{ name: 'BGAN_test1.OUT', type: DPS }, { name: 'BGAN_test2.OUT', type: DPS }]
const testFileContents = 'This is a test file'
const daxMockFileList = [{ name: 'BGAN_test3.ack', type: DAX }, { name: 'BGAN_test4.ack', type: DAX }]
const daxTestFileContents = 'This is a dax test file'

let blobServiceClient
let dpscontainer
let daxcontainer

describe('Blob storage tests', () => {
  beforeEach(async () => {
    blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
    dpscontainer = blobServiceClient.getContainerClient(storageConfig.dpsContainer)
    daxcontainer = blobServiceClient.getContainerClient(storageConfig.daxContainer)
    await dpscontainer.deleteIfExists()
    await dpscontainer.createIfNotExists()
    await daxcontainer.deleteIfExists()
    await daxcontainer.createIfNotExists()

    for (const file of mockFileList) {
      const blob = dpscontainer.getBlockBlobClient(`${storageConfig.inboundFolder}/${file.name}`)
      const buffer = Buffer.from(testFileContents)
      await blob.upload(buffer, buffer.byteLength)
    }
    for (const file of daxMockFileList) {
      const blob = daxcontainer.getBlockBlobClient(`${storageConfig.inboundFolder}/${file.name}`)
      const buffer = Buffer.from(daxTestFileContents)
      await blob.upload(buffer, buffer.byteLength)
    }
  })

  test('List files in both DPS and DAX inbound blob containers', async () => {
    const fileList = await blobStorage.getPendingFiles()
    expect(fileList).toEqual(expect.arrayContaining(mockFileList.concat(daxMockFileList)))
  })

  test('Download blob into buffer from DPS blob container', async () => {
    const buffer = await blobStorage.getFile(mockFileList[0].name, DPS)
    const bufferContent = buffer.toString()

    expect(buffer).toBeInstanceOf(Buffer)
    expect(bufferContent).toEqual(testFileContents)
  })

  test('Download blob into buffer from DAX blob container', async () => {
    const buffer = await blobStorage.getFile(daxMockFileList[0].name, DAX)
    const bufferContent = buffer.toString()

    expect(buffer).toBeInstanceOf(Buffer)
    expect(bufferContent).toEqual(daxTestFileContents)
  })

  test('Copy blob from inbound to DPS archive container', async () => {
    const result = await blobStorage.archiveFile(mockFileList[0].name, DPS)
    const fileList = await blobStorage.getPendingFiles()
    expect(result).toEqual(true)
    expect(fileList.length).toEqual(mockFileList.length + daxMockFileList.length - 1)
  })

  test('Copy blob from inbound to DAX archive container', async () => {
    const result = await blobStorage.archiveFile(daxMockFileList[0].name, DAX)
    const fileList = await blobStorage.getPendingFiles()

    expect(result).toEqual(true)
    expect(fileList.length).toEqual(mockFileList.length + daxMockFileList.length - 1)
  })

  test('Copy blob from inbound to DPS quarantine container', async () => {
    const result = await blobStorage.quarantineFile(mockFileList[0].name, DPS)
    const fileList = await blobStorage.getPendingFiles()

    expect(result).toEqual(true)
    expect(fileList.length).toEqual(mockFileList.length + daxMockFileList.length - 1)
  })

  test('Copy blob from inbound to DAX quarantine container', async () => {
    const result = await blobStorage.quarantineFile(daxMockFileList[0].name, DAX)
    const fileList = await blobStorage.getPendingFiles()

    expect(result).toEqual(true)
    expect(fileList.length).toEqual(mockFileList.length + daxMockFileList.length - 1)
  })
})
