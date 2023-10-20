const { getOutboundBlobClient } = require('../storage')
const { writeToString } = require('@fast-csv/format')
const { getNewFileName } = require('./get-new-filename')
const { getNewContent } = require('./get-new-content')

const publish = async (content, filename, fileType) => {
  filename = getNewFileName(filename, fileType)
  const newContent = getNewContent(content, fileType)
  const body = await writeToString(newContent)
  console.log(body)
  const outboundBlobClient = await getOutboundBlobClient(filename, fileType)
  await outboundBlobClient.upload(body, body.length)
  console.info(`Published ${filename}`)
}

module.exports = {
  publish
}
