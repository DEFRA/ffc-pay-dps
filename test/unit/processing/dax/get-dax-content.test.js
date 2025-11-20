const { getDAXContent } = require('../../../../app/processing/dax/get-dax-content')
const daxReference = require('../../../mocks/dax-reference')
const daxSecurityRequestLine = require('../../../mocks/dax-security-request-line')
const loaded = require('../../../mocks/loaded')
const posted = require('../../../mocks/posted')
const primaryTrader = require('../../../mocks/primary-trader')
const reason = require('../../../mocks/reason')
const reference = require('../../../mocks/reference')
const usedByTrader = require('../../../mocks/used-by-trader')

describe('getDAXContent', () => {
  const expectedValues = [
    [0, 0, primaryTrader],
    [0, 1, usedByTrader],
    [0, 2, reference],
    [0, 3, loaded],
    [0, 4, daxReference],
    [0, 5, reason],
    [0, 6, posted]
  ]

  test.each(expectedValues)('returns correct value at [%i][%i]', (_, col, expected) => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][col]).toBe(expected)
  })

  test('returns empty string if a value is empty', () => {
    const modifiedLine = { ...daxSecurityRequestLine, reason: '' }
    const result = getDAXContent(modifiedLine)
    expect(result[0][5]).toBe('')
  })
})
