const { v4: uuidv4 } = require('uuid')
const { DAX } = require('../../constants/file-types')
const BATCH_LINES = {
  PRIMARY_TRADER: 0,
  USED_BY_TRADER: 1,
  REFERENCE: 2,
  LOADED: 3,
  DAX_REFERENCE: 4,
  REASON: 5,
  POSTED: 6
}

const transformLine = (batchLine, filename) => {
  return {
    correlationId: uuidv4(),
    batch: filename,
    fileTypeId: DAX.fileTypeId,
    primaryTrader: batchLine[BATCH_LINES.PRIMARY_TRADER],
    usedByTrader: batchLine[BATCH_LINES.USED_BY_TRADER],
    reference: batchLine[BATCH_LINES.REFERENCE],
    loaded: batchLine[BATCH_LINES.LOADED],
    daxReference: batchLine[BATCH_LINES.DAX_REFERENCE],
    reason: batchLine[BATCH_LINES.REASON],
    posted: batchLine[BATCH_LINES.POSTED]
  }
}

module.exports = {
  transformLine,
  BATCH_LINES
}
