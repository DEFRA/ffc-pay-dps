const { v4: uuidv4 } = require('uuid')
const { DAX } = require('../../constants/file-types')

const transformLine = (batchLine, filename) => {
  return {
    correlationId: uuidv4(),
    batch: filename,
    fileTypeId: DAX.fileTypeId,
    primaryTrader: batchLine[0],
    usedByTrader: batchLine[1],
    reference: batchLine[2],
    loaded: batchLine[3],
    daxReference: batchLine[4],
    reason: batchLine[5],
    posted: batchLine[6]
  }
}

module.exports = {
  transformLine
}
