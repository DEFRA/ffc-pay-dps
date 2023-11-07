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

describe('Get DPS content in right format', () => {
  test('returns primary trader at index 0, 0', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][0]).toBe(primaryTrader)
  })

  test('returns used by trader at index 0, 1', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][1]).toBe(usedByTrader)
  })

  test('returns reference at index 0, 2', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][2]).toBe(reference)
  })

  test('returns full reference at index 0, 3', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][3]).toBe(fullReference)
  })

  test('returns guarantee number at index 0, 4', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][4]).toBe(guaranteeNumber)
  })

  test('returns scheme at index 0, 5', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][5]).toBe(scheme)
  })

  test('returns debit at index 0, 6', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][6]).toBe(debit)
  })

  test('returns credit at index 0, 7', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][7]).toBe(credit)
  })

  test('returns currency at index 0, 8', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][8]).toBe(currency)
  })

  test('returns transactionCategory at index 0, 9', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][9]).toBe(transactionCategory)
  })

  test('returns makeForwardDate at index 0, 10', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][10]).toBe(makeForwardDate)
  })

  test('returns measurementStartDate at index 0, 11', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][11]).toBe(measurementStartDate)
  })

  test('returns description at index 0, 12', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][12]).toBe(description)
  })

  test('returns primary FRN at index 0, 13', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][13]).toBe('1234567890')
  })

  test('returns usedBy FRN at index 0, 14', async () => {
    const result = getDPSContent(secReqLn)
    expect(result[0][14]).toBe('0987654321')
  })

  test('returns empty string if any given value is an empty string', async () => {
    secReqLn.guaranteeNumber = ''
    const result = getDPSContent(secReqLn)
    expect(result[0][4]).toBe('')
  })
})
