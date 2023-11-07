const { DAX } = require('../../app/constants/file-types')
const correlationId = require('./correlation-id')
const filename = require('./filename')
const primaryTrader = require('./primary-trader')
const usedByTrader = require('./used-by-trader')
const reference = require('./reference')
const fullReference = require('./full-reference')
const guaranteeNumber = require('./guarantee-number')
const scheme = require('./scheme')
const debit = require('./debit')
const credit = require('./credit')
const currency = require('./currency')
const transactionCategory = require('./transaction-category')
const measurementStartDate = require('./measurement-start-date')
const makeForwardDate = require('./make-forward-date')
const description = require('./description')

module.exports = {
  correlationId,
  batch: filename,
  fileTypeId: DAX.fileTypeId,
  primaryTrader,
  usedByTrader,
  reference,
  fullReference,
  guaranteeNumber,
  scheme,
  debit,
  credit,
  currency,
  transactionCategory,
  makeForwardDate,
  measurementStartDate,
  description

}
