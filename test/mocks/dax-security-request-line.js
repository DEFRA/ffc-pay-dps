const { DAX } = require('../../app/constants/file-types')
const correlationId = require('./correlation-id')
const filename = require('./filename')
const primaryTrader = require('./primary-trader')
const usedByTrader = require('./used-by-trader')
const reference = require('./reference')
const loaded = require('./loaded')
const daxReference = require('./dax-reference')
const reason = require('./reason')
const posted = require('./posted')

module.exports = {
  correlationId,
  batch: filename,
  fileTypeId: DAX.fileTypeId,
  primaryTrader,
  usedByTrader,
  reference,
  loaded,
  daxReference,
  reason,
  posted
}
