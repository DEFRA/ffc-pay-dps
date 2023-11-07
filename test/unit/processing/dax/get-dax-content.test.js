const { getDAXContent } = require('../../../../app/processing/dax/get-dax-content')
const daxReference = require('../../../mocks/dax-reference')
const daxSecurityRequestLine = require('../../../mocks/dax-security-request-line')
const loaded = require('../../../mocks/loaded')
const posted = require('../../../mocks/posted')
const primaryTrader = require('../../../mocks/primary-trader')
const reason = require('../../../mocks/reason')
const reference = require('../../../mocks/reference')
const usedByTrader = require('../../../mocks/used-by-trader')

describe('Get DAX content in right format', () => {
  test('returns primary trader at index 0, 0', async () => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][0]).toBe(primaryTrader)
  })

  test('returns used by trader at index 0, 1', async () => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][1]).toBe(usedByTrader)
  })

  test('returns reference at index 0, 2', async () => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][2]).toBe(reference)
  })

  test('returns loaded at index 0, 3', async () => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][3]).toBe(loaded)
  })

  test('returns dax reference at index 0, 4', async () => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][4]).toBe(daxReference)
  })

  test('returns dax reference at index 0, 4', async () => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][4]).toBe(daxReference)
  })

  test('returns reason at index 0, 5', async () => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][5]).toBe(reason)
  })

  test('returns posted at index 0, 6', async () => {
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][6]).toBe(posted)
  })

  test('returns empty string if any given value is an empty string', async () => {
    daxSecurityRequestLine.reason = ''
    const result = getDAXContent(daxSecurityRequestLine)
    expect(result[0][5]).toBe('')
  })
})
