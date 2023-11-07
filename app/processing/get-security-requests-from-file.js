const readline = require('readline')
const { Readable } = require('stream')
const { DPS, DAX } = require('../constants/file-types')
const { readDPSFile } = require('./dps/read-dps-file')
const { readDAXFile } = require('./dax/read-dax-file')

const getSecurityRequestsFromFile = (fileBuffer, fileType, filename) => {
  const input = Readable.from(fileBuffer)
  const readBatchLines = readline.createInterface(input)
  switch (fileType) {
    case DPS:
      return readDPSFile(readBatchLines, input, filename)
    case DAX:
      return readDAXFile(readBatchLines, input, filename)
  }
}

module.exports = getSecurityRequestsFromFile
