const { getDPSContent } = require('../../../../app/processing/dps/get-dps-content')
const credit = require('../../../mocks/credit')
const currency = require('../../../mocks/currency')
const debit = require('../../../mocks/debit')
const description = require('../../../mocks/description')
const dpsSecurityRequestLine = require('../../../mocks/dps-security-request-line')
const fullReference = require('../../../mocks/full-reference')
const guaranteeNumber = require('../../../mocks/guarantee-number')
const makeForwardDate = require('../../../mocks/make-forward-date')
const measurementStartDate = require('../../../mocks/measurement-start-date')
const primaryTrader = require('../../../mocks/primary-trader')
const reference = require('../../../mocks/reference')
const scheme = require('../../../mocks/scheme')
const transactionCategory = require('../../../mocks/transaction-category')
const usedByTrader = require('../../../mocks/used-by-trader')

const secReqLn = {
  ...dpsSecurityRequestLine,
  primaryFRN: '1234567890',
  usedByFRN: '0987654321'
}

describe('getDPSContent', () => {
  const expectedValues = [
    [0, 0, primaryTrader],
    [0, 1, usedByTrader],
    [0, 2, reference],
    [0, 3, fullReference],
    [0, 4, guaranteeNumber],
    [0, 5, scheme],
    [0, 6, debit],
    [0, 7, credit],
    [0, 8, currency],
    [0, 9, transactionCategory],
    [0, 10, makeForwardDate],
    [0, 11, measurementStartDate],
    [0, 12, description],
    [0, 13, '1234567890'],
    [0, 14, '0987654321']
  ]

  test.each(expectedValues)('returns correct value at [%i][%i]', (_, col, expected) => {
    const result = getDPSContent(secReqLn)
    expect(result[0][col]).toBe(expected)
  })

  test('returns empty string if a value is empty', () => {
    const modifiedLine = { ...secReqLn, guaranteeNumber: '' }
    const result = getDPSContent(modifiedLine)
    expect(result[0][4]).toBe('')
  })
})
