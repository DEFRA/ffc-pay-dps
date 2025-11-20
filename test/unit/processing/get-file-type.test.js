const getFileType = require('../../../app/processing/get-file-type')
const { DPS, DAX, UNKNOWN } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

describe('getFileType', () => {
  test('returns DPS for DPS filename', () => {
    const result = getFileType(filename.DPS)
    expect(result).toMatchObject(DPS)
  })

  test('returns DAX for DAX return filename', () => {
    const result = getFileType(filename.DAX)
    expect(result).toMatchObject(DAX)
  })

  test('returns UNKNOWN for pending DPS filename', () => {
    const result = getFileType('PENDING_' + filename.DPS)
    expect(result).toMatchObject(UNKNOWN)
  })

  test.each([
    undefined,
    null,
    '',
    {},
    [],
    true,
    false,
    0,
    1,
    'NOTAREALSCHEME_0001_AP_20220317104956617.OUT'
  ])('returns UNKNOWN for invalid filename: %p', (input) => {
    const result = getFileType(input)
    expect(result).toMatchObject(UNKNOWN)
  })
})
