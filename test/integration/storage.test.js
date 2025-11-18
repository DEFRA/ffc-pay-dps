const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('../../app/config')
const blobStorage = require('../../app/storage')
const { DPS, DAX } = require('../../app/constants/file-types')

const mockDpsFiles = [{ name: 'BGAN_test1.OUT', type: DPS }, { name: 'BGAN_test2.OUT', type: DPS }]
const mockDaxFiles = [{ name: 'FFCBGAN_test3.ack', type: DAX }, { name: 'FFCBGAN_test4.ack', type: DAX }]
const testFileContents = 'This is a test file'
const daxTestFileContents = 'This is a dax test file'

let blobServiceClient, dpsContainer, daxContainer

const uploadFiles = async (container, files, content) => {
  for (const file of files) {
    const blob = container.getBlockBlobClient(`${storageConfig.inboundFolder}/${file.name}`)
    const buffer = Buffer.from(content)
    await blob.upload(buffer, buffer.byteLength)
  }
}

describe('Blob storage', () => {
  beforeEach(async () => {
    blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
    dpsContainer = blobServiceClient.getContainerClient(storageConfig.dpsContainer)
    daxContainer = blobServiceClient.getContainerClient(storageConfig.daxContainer)

    await dpsContainer.deleteIfExists()
    await dpsContainer.createIfNotExists()
    await daxContainer.deleteIfExists()
    await daxContainer.createIfNotExists()

    await uploadFiles(dpsContainer, mockDpsFiles, testFileContents)
    await uploadFiles(daxContainer, mockDaxFiles, daxTestFileContents)
  })

  test('lists all pending files in DPS and DAX containers', async () => {
    const fileList = await blobStorage.getPendingFiles()
    expect(fileList).toEqual(expect.arrayContaining([...mockDpsFiles, ...mockDaxFiles]))
  })

  test.each([
    [mockDpsFiles[0], DPS, testFileContents],
    [mockDaxFiles[0], DAX, daxTestFileContents]
  ])('downloads blob %s from %s container', async (file, type, expectedContent) => {
    const buffer = await blobStorage.getFile(file.name, type)
    expect(buffer).toBeInstanceOf(Buffer)
    expect(buffer.toString()).toEqual(expectedContent)
  })

  test.each([
    [mockDpsFiles[0], DPS, 'archiveFile'],
    [mockDaxFiles[0], DAX, 'archiveFile'],
    [mockDpsFiles[0], DPS, 'quarantineFile'],
    [mockDaxFiles[0], DAX, 'quarantineFile']
  ])('moves %s to %s container using %s', async (file, type, method) => {
    const result = await blobStorage[method](file.name, type)
    const fileList = await blobStorage.getPendingFiles()

    expect(result).toBe(true)
    expect(fileList.length).toBe([...mockDpsFiles, ...mockDaxFiles].length - 1)
  })
})
