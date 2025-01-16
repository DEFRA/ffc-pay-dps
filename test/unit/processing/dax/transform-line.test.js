const { DAX } = require('../../../../app/constants/file-types')
const {
  transformLine,
  BATCH_LINES
} = require('../../../../app/processing/dax/transform-line')
const filename = require('../../../mocks/filename')

const batchLine = [
  '010540',
  '010540',
  '1RB13915',
  'Yes',
  'GT0362947',
  'Transfer of goods',
  'Yes'
]

describe('Transform DAX line', () => {
  let result

  beforeEach(() => {
    result = transformLine(batchLine, filename.DAX)
  })

  test('returns correlationId', () => {
    expect(result.correlationId).not.toBe(null)
  })

  test('returns batch', () => {
    expect(result.batch).toBe(filename.DAX)
  })

  test('returns fileTypeId of DAX ID', () => {
    expect(result.fileTypeId).toBe(DAX.fileTypeId)
  })

  test('returns primaryTrader', () => {
    expect(result.primaryTrader).toBe('010540')
  })

  test('returns usedByTrader', () => {
    expect(result.usedByTrader).toBe('010540')
  })

  test('returns reference', () => {
    expect(result.reference).toBe('1RB13915')
  })

  test('returns loaded status', () => {
    expect(result.loaded).toBe('Yes')
  })

  test('returns daxReference', () => {
    expect(result.daxReference).toBe('GT0362947')
  })

  test('returns reason', () => {
    expect(result.reason).toBe('Transfer of goods')
  })

  test('returns posted status', () => {
    expect(result.posted).toBe('Yes')
  })

  test('returns complete object structure', () => {
    expect(result).toEqual({
      correlationId: expect.any(String),
      batch: filename.DAX,
      fileTypeId: DAX.fileTypeId,
      primaryTrader: '010540',
      usedByTrader: '010540',
      reference: '1RB13915',
      loaded: 'Yes',
      daxReference: 'GT0362947',
      reason: 'Transfer of goods',
      posted: 'Yes'
    })
  })

  test('BATCH_LINES constant is exported correctly', () => {
    expect(BATCH_LINES).toEqual({
      PRIMARY_TRADER: 0,
      USED_BY_TRADER: 1,
      REFERENCE: 2,
      LOADED: 3,
      DAX_REFERENCE: 4,
      REASON: 5,
      POSTED: 6
    })
  })
})
