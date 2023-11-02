const { getOutboundBlobClient } = require('../storage')
const { writeToString } = require('@fast-csv/format')
const { getNewFileName } = require('./get-new-filename')
const { getNewContent } = require('./get-new-content')
const { DAX } = require('../constants/file-types')

const publish = async (content, filename, fileType) => {
  filename = getNewFileName(filename, fileType)
  const newContent = getNewContent(content, fileType)
  const body = await writeToString(newContent)
  const outboundBlobClient = await getOutboundBlobClient(filename, fileType)
  await outboundBlobClient.upload(body, body.length)
  if (fileType === DAX) {
    const ctlFileName = 'CTL_' + filename
    const ctlOutboundBlobClient = await getOutboundBlobClient(ctlFileName, fileType)
    await ctlOutboundBlobClient.upload('', 0)
  }
  console.info(`Published ${filename}`)
}

module.exports = {
  publish
}
