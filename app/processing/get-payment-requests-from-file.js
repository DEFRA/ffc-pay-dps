const readline = require('readline')
const { Readable } = require('stream')
const { DPS, DAX } = require('../constants/file-types')
const { readDPSFile } = require('./dps/read-dps-file')

const getPaymentRequestsFromFile = (fileBuffer, fileType, filename) => {
  const input = Readable.from(fileBuffer)
  const readBatchLines = readline.createInterface(input)
  switch (fileType) {
    case DPS:
      return readDPSFile(readBatchLines, fileType, input, filename)
    case DAX:
      console.log(`DAX file discovered: ${filename}`)
      // return await readDAXFile(readBatchLines, fileType, input, filename)
  }
}

module.exports = getPaymentRequestsFromFile
