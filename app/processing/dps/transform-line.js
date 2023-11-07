const { v4: uuidv4 } = require('uuid')
const { DPS } = require('../../constants/file-types')

const transformLine = (batchLine, filename) => {
  return {
    correlationId: uuidv4(),
    batch: filename,
    fileTypeId: DPS.fileTypeId,
    primaryTrader: batchLine[0],
    usedByTrader: batchLine[1],
    reference: batchLine[2],
    fullReference: batchLine[3],
    guaranteeNumber: batchLine[4],
    scheme: batchLine[5],
    debit: batchLine[6],
    credit: batchLine[7],
    currency: batchLine[8],
    transactionCategory: batchLine[9],
    makeForwardDate: batchLine[10],
    measurementStartDate: batchLine[11],
    description: batchLine[12]
  }
}

module.exports = {
  transformLine
}
