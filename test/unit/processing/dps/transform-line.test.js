const { DPS } = require('../../../../app/constants/file-types')
const {
  transformLine,
  BATCH_LINES
} = require('../../../../app/processing/dps/transform-line')
const filename = require('../../../mocks/filename')

const batchLine = [
  '706475', // PRIMARY_TRADER
  '706475', // USED_BY_TRADER
  '1BH24607', // REFERENCE
  '1BH24607', // FULL_REFERENCE
  '2100', // GUARANTEE_NUMBER
  'SCHEME1', // SCHEME
  '', // DEBIT
  '471.00', // CREDIT
  'GBP', // CURRENCY
  'Import', // TRANSACTION_CATEGORY
  '', // MAKE_FORWARD_DATE
  '08/09/2023', // MEASUREMENT_START_DATE
  'Test description' // DESCRIPTION
]

describe('Transform DPS line', () => {
  let result

  beforeEach(() => {
    result = transformLine(batchLine, filename.DPS)
  })

  describe('Core fields', () => {
    test('returns correlationId as UUID', () => {
      expect(result.correlationId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      )
    })

    test('returns batch filename', () => {
      expect(result.batch).toBe(filename.DPS)
    })

    test('returns correct fileTypeId', () => {
      expect(result.fileTypeId).toBe(DPS.fileTypeId)
    })
  })

  describe('Trader information', () => {
    test('returns primaryTrader', () => {
      expect(result.primaryTrader).toBe('706475')
    })

    test('returns usedByTrader', () => {
      expect(result.usedByTrader).toBe('706475')
    })
  })

  describe('Reference information', () => {
    test('returns reference', () => {
      expect(result.reference).toBe('1BH24607')
    })

    test('returns fullReference', () => {
      expect(result.fullReference).toBe('1BH24607')
    })

    test('returns guaranteeNumber', () => {
      expect(result.guaranteeNumber).toBe('2100')
    })
  })

  describe('Financial information', () => {
    test('returns scheme', () => {
      expect(result.scheme).toBe('SCHEME1')
    })

    test('returns debit', () => {
      expect(result.debit).toBe('')
    })

    test('returns credit', () => {
      expect(result.credit).toBe('471.00')
    })

    test('returns currency', () => {
      expect(result.currency).toBe('GBP')
    })
  })

  describe('Additional information', () => {
    test('returns transactionCategory', () => {
      expect(result.transactionCategory).toBe('Import')
    })

    test('returns makeForwardDate', () => {
      expect(result.makeForwardDate).toBe('')
    })

    test('returns measurementStartDate', () => {
      expect(result.measurementStartDate).toBe('08/09/2023')
    })

    test('returns description', () => {
      expect(result.description).toBe('Test description')
    })
  })

  test('returns complete object structure', () => {
    expect(result).toEqual({
      correlationId: expect.any(String),
      batch: filename.DPS,
      fileTypeId: DPS.fileTypeId,
      primaryTrader: '706475',
      usedByTrader: '706475',
      reference: '1BH24607',
      fullReference: '1BH24607',
      guaranteeNumber: '2100',
      scheme: 'SCHEME1',
      debit: '',
      credit: '471.00',
      currency: 'GBP',
      transactionCategory: 'Import',
      makeForwardDate: '',
      measurementStartDate: '08/09/2023',
      description: 'Test description'
    })
  })

  test('BATCH_LINES constant is exported correctly', () => {
    expect(BATCH_LINES).toEqual({
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
    })
  })
})
