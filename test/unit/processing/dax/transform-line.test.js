const { DAX } = require('../../../../app/constants/file-types')
const { transformLine } = require('../../../../app/processing/dax/transform-line')
const filename = require('../../../mocks/filename')

const batchLine = ['010540', '010540', '1RB13915', 'Yes', 'GT0362947', 'Transfer of goods', 'Yes']

describe('transformLine', () => {
  const expectedValues = [
    ['batch', filename.DAX],
    ['fileTypeId', DAX.fileTypeId],
    ['primaryTrader', '010540'],
    ['usedByTrader', '010540'],
    ['reference', '1RB13915'],
    ['loaded', 'Yes'],
    ['daxReference', 'GT0362947'],
    ['reason', 'Transfer of goods'],
    ['posted', 'Yes']
  ]

  test.each(expectedValues)('returns correct %s', (key, expected) => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result[key]).toBe(expected)
  })

  test('returns correlationId', () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.correlationId).not.toBeNull()
  })

  describe('handles empty batchLine', () => {
    let result
    beforeAll(() => {
      result = transformLine([], filename.DAX)
    })

    test('returns correlationId', () => {
      expect(result.correlationId).not.toBeNull()
    })

    test('returns batch', () => {
      expect(result.batch).toBe(filename.DAX)
    })
  })
})
