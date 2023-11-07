const batch = require('./batch')
const downloadAndParse = require('./download-and-parse')

const processIfValid = async (filename, fileType) => {
  await batch.create(filename, fileType.fileTypeId)
  await downloadAndParse(filename, fileType)
}

module.exports = processIfValid
