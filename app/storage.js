const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const { storageConfig } = require('./config')
const { UNKNOWN, DPS } = require('./constants/file-types')
const getFileType = require('./processing/get-file-type')
let blobServiceClient
let containersInitialised
let foldersInitialised

if (storageConfig.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(storageConfig.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${storageConfig.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential({ managedIdentityClientId: config.managedIdentityClientId }))
}

const container = blobServiceClient.getContainerClient(storageConfig.dpsContainer)
const daxContainer = blobServiceClient.getContainerClient(storageConfig.daxContainer)

const initialiseContainers = async () => {
  if (storageConfig.createContainers) {
    console.log('Making sure blob containers exist')
    await container.createIfNotExists()
    await daxContainer.createIfNotExists()
    console.log('Containers ready')
  }
  foldersInitialised ?? await initialiseFolders()
  containersInitialised = true
}

const initialiseFolders = async () => {
  console.log('Making sure folders exist')
  const placeHolderText = 'Placeholder'
  const inboundClient = container.getBlockBlobClient(`${storageConfig.inboundFolder}/default.txt`)
  await inboundClient.upload(placeHolderText, placeHolderText.length)
  const daxOutboundClient = daxContainer.getBlockBlobClient(`${storageConfig.inboundFolder}/default.txt`)
  await daxOutboundClient.upload(placeHolderText, placeHolderText.length)
  foldersInitialised = true
  console.log('Folders ready')
}

const getBlob = async (folder, filename, fileType) => {
  const fileContainer = fileType === DPS ? container : daxContainer
  containersInitialised ?? await initialiseContainers()
  return fileContainer.getBlockBlobClient(`${folder}/${filename}`)
}

const getFile = async (filename, fileType) => {
  filename = sanitizeFilename(filename, fileType)
  console.log(`Searching for ${filename}`)
  const blob = await getBlob(storageConfig.inboundFolder, filename, fileType)
  const downloaded = await blob.downloadToBuffer()
  console.log(`Found ${filename}`)
  return downloaded
}

const getPendingFiles = async () => {
  containersInitialised ?? await initialiseContainers()

  const fileList = []
  const dpsContainerFileList = container.listBlobsFlat({ prefix: storageConfig.inboundFolder })
  for await (const file of dpsContainerFileList) {
    const filename = file.name.replace(`${storageConfig.inboundFolder}/`, '')
    const type = getFileType(filename)
    if (type !== UNKNOWN) {
      fileList.push({ type, name: filename })
    }
  }
  const daxContainerFileList = daxContainer.listBlobsFlat({ prefix: storageConfig.inboundFolder })
  for await (const file of daxContainerFileList) {
    const filename = file.name.replace(`${storageConfig.inboundFolder}/`, '')
    const type = getFileType(filename)
    if (type !== UNKNOWN) {
      fileList.push({ type, name: filename })
    }
  }
  return fileList
}

// Copies blob from one folder to another folder and deletes blob from original folder
const moveFile = async (sourceFolder, destinationFolder, filename, fileType) => {
  const sourceBlob = await getBlob(sourceFolder, filename, fileType)
  const destinationBlob = await getBlob(destinationFolder, filename, fileType)
  const copyResult = await (await destinationBlob.beginCopyFromURL(sourceBlob.url)).pollUntilDone()
  if (copyResult.copyStatus === 'success') {
    await sourceBlob.delete()
    return true
  }

  return false
}

const archiveFile = async (filename, fileType) => {
  return moveFile(storageConfig.inboundFolder, storageConfig.archiveFolder, filename, fileType)
}

const sanitizeFilename = (filename, fileType) => {
  const fileContainer = fileType === DPS ? container : daxContainer
  return filename.replace(`${fileContainer}/${storageConfig.inboundFolder}/`, '')
}

const quarantineFile = async (filename, fileType) => {
  return moveFile(storageConfig.inboundFolder, storageConfig.quarantineFolder, filename, fileType)
}

const getOutboundBlobClient = async (filename, fileType) => {
  containersInitialised ?? await initialiseContainers()
  const folder = fileType === DPS ? storageConfig.outboundFolder : storageConfig.returnFolder
  return daxContainer.getBlockBlobClient(`${folder}/${filename}`)
}

module.exports = {
  getPendingFiles,
  getFile,
  archiveFile,
  quarantineFile,
  getOutboundBlobClient
}
