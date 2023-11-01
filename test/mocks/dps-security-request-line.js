const { DAX } = require('../../app/constants/file-types')
const correlationId = require('./correlation-id')
const filename = require('./filename')
const primaryTrader = require('./primary-trader')
const usedByTrader = require('./used-by-trader')
const reference = require('./reference')
const scheme = require('./scheme')
const credit = require('./credit')
const currency = require('./currency')
const transactionCategory = require('./transaction-category')
const date = require('./date')

module.exports = {
  correlationId,
  batch: filename,
  fileTypeId: DAX.fileTypeId,
  primaryTrader,
  usedByTrader,
  reference,
  fullReference: reference,
  guaranteeNumber: '',
  scheme,
  debit: '',
  credit,
  currency,
  transactionCategory,
  makeForwardDate: '',
  measurementStartDate: date,
  description: ''

}
