const { DefaultAzureCredential } = require('@azure/identity')
const { BlobServiceClient } = require('@azure/storage-blob')
const config = require('./config/storage')
let blobServiceClient
let containersInitialised
let foldersInitialised

if (config.useConnectionStr) {
  console.log('Using connection string for BlobServiceClient')
  blobServiceClient = BlobServiceClient.fromConnectionString(config.connectionStr)
} else {
  console.log('Using DefaultAzureCredential for BlobServiceClient')
  const uri = `https://${config.storageAccount}.blob.core.windows.net`
  blobServiceClient = new BlobServiceClient(uri, new DefaultAzureCredential())
}

const container = blobServiceClient.getContainerClient(config.dpsContainer)
const daxContainer = blobServiceClient.getContainerClient(config.daxContainer)

const initialiseContainers = async () => {
  if (config.createContainers) {
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
  const inboundClient = container.getBlockBlobClient(`${config.inboundFolder}/default.txt`)
  await inboundClient.upload(placeHolderText, placeHolderText.length)
  const daxInboundClient = daxContainer.getBlockBlobClient(`${config.inboundFolder}/default.txt`)
  await daxInboundClient.upload(placeHolderText, placeHolderText.length)
  foldersInitialised = true
  console.log('Folders ready')
}

const getBlob = async (folder, filename, dax) => {
  containersInitialised ?? await initialiseContainers()
  return dax ? daxContainer.getBlockBlobClient(`${folder}/${filename}`) : container.getBlockBlobClient(`${folder}/${filename}`)
}

const getFile = async (filename, dax) => {
  filename = sanitizeFilename(filename)
  console.log(`Searching for ${filename}`)
  const blob = await getBlob(config.inboundFolder, filename, dax)
  const downloaded = await blob.downloadToBuffer()
  console.log(`Found ${filename}`)
  return downloaded.toString()
}

const getPendingControlFiles = async (dax) => {
  containersInitialised ?? await initialiseContainers()

  const fileList = []
  const containerFileList = dax ? daxContainer.listBlobsFlat() : container.listBlobsFlat()
  for await (const file of containerFileList) {
    const filename = file.name.replace(`${config.inboundFolder}/`, '')
    fileList.push({ name: filename })
  }

  return fileList
}

// Copies blob from one folder to another folder and deletes blob from original folder
const moveFile = async (sourceFolder, destinationFolder, sourceFilename, destinationFilename, dax) => {
  const sourceBlob = await getBlob(sourceFolder, sourceFilename, dax)
  const destinationBlob = await getBlob(destinationFolder, destinationFilename, dax)
  const copyResult = await (await destinationBlob.beginCopyFromURL(sourceBlob.url)).pollUntilDone()

  if (copyResult.copyStatus === 'success') {
    await sourceBlob.delete()
    return true
  }

  return false
}

const archiveFile = async (filename, dax) => {
  return moveFile(config.inboundFolder, config.archiveFolder, filename, filename, dax)
}

const renameFile = async (filename, targetFilename, dax) => {
  filename = sanitizeFilename(filename, dax)
  targetFilename = sanitizeFilename(targetFilename, dax)
  return moveFile(config.inboundFolder, config.inboundFolder, filename, targetFilename, dax)
}

const sanitizeFilename = (filename, dax) => {
  return dax ? filename.replace(`${config.daxContainer}/${config.inboundFolder}/`, '') : filename.replace(`${config.container}/${config.inboundFolder}/`, '')
}

module.exports = {
  getPendingControlFiles,
  getFile,
  renameFile,
  archiveFile
}
