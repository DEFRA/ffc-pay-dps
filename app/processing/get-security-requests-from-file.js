const readline = require('readline')
const { Readable } = require('stream')
const { DPS, DAX } = require('../constants/file-types')
const { readDPSFile } = require('./dps/read-dps-file')
const { readDAXFile } = require('./dax/read-dax-file')

const getSecurityRequestsFromFile = async (fileBuffer, fileType, filename) => {
  const input = Readable.from(fileBuffer)
  const readBatchLines = readline.createInterface(input)

  try {
    let result
    switch (fileType) {
      case DPS:
        result = await readDPSFile(readBatchLines, input, filename)
        break
      case DAX:
        result = await readDAXFile(readBatchLines, input, filename)
        break
      default:
        result = {
          error: `Unsupported file type: ${fileType?.fileType ?? 'undefined'}`
        }
    }
    return result
  } finally {
    readBatchLines.close()
    input.destroy()
  }
}

module.exports = getSecurityRequestsFromFile
