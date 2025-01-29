const { v4: uuidv4 } = require('uuid')
const { DPS } = require('../../constants/file-types')
const BATCH_LINES = {
  PRIMARY_TRADER: 0,
  USED_BY_TRADER: 1,
  REFERENCE: 2,
  FULL_REFERENCE: 3,
  GUARANTEE_NUMBER: 4,
  SCHEME: 5,
  DEBIT: 6,
  CREDIT: 7,
  CURRENCY: 8,
  TRANSACTION_CATEGORY: 9,
  MAKE_FORWARD_DATE: 10,
  MEASUREMENT_START_DATE: 11,
  DESCRIPTION: 12
}

const transformLine = (batchLine, filename) => {
  return {
    correlationId: uuidv4(),
    batch: filename,
    fileTypeId: DPS.fileTypeId,
    primaryTrader: batchLine[BATCH_LINES.PRIMARY_TRADER],
    usedByTrader: batchLine[BATCH_LINES.USED_BY_TRADER],
    reference: batchLine[BATCH_LINES.REFERENCE],
    fullReference: batchLine[BATCH_LINES.FULL_REFERENCE],
    guaranteeNumber: batchLine[BATCH_LINES.GUARANTEE_NUMBER],
    scheme: batchLine[BATCH_LINES.SCHEME],
    debit: batchLine[BATCH_LINES.DEBIT],
    credit: batchLine[BATCH_LINES.CREDIT],
    currency: batchLine[BATCH_LINES.CURRENCY],
    transactionCategory: batchLine[BATCH_LINES.TRANSACTION_CATEGORY],
    makeForwardDate: batchLine[BATCH_LINES.MAKE_FORWARD_DATE],
    measurementStartDate: batchLine[BATCH_LINES.MEASUREMENT_START_DATE],
    description: batchLine[BATCH_LINES.DESCRIPTION]
  }
}

module.exports = {
  transformLine,
  BATCH_LINES
}
