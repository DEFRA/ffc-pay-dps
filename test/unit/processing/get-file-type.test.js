const getFileType = require('../../../app/processing/get-file-type')
const { DPS, DAX, UNKNOWN } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

describe('Get file type', () => {
  test('returns DPS for DPS filename', async () => {
    const result = getFileType(filename.DPS)
    expect(result).toMatchObject(DPS)
  })

  test('returns DAX for DAX return filename', async () => {
    const result = getFileType(filename.DAX)
    expect(result).toMatchObject(DAX)
  })

  test('returns unknown for pending DPS filename', async () => {
    const result = getFileType('PENDING_' + filename.DPS)
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for unknown filename', async () => {
    const result = getFileType('NOTAREALSCHEME_0001_AP_20220317104956617.OUT')
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for no filename', async () => {
    const result = getFileType()
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for undefined filename', async () => {
    const result = getFileType(undefined)
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for object filename', async () => {
    const result = getFileType({})
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for array filename', async () => {
    const result = getFileType([])
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for null filename', async () => {
    const result = getFileType(null)
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for true filename', async () => {
    const result = getFileType(true)
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for false filename', async () => {
    const result = getFileType(false)
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for 1 filename', async () => {
    const result = getFileType(1)
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for 0 filename', async () => {
    const result = getFileType(0)
    expect(result).toMatchObject(UNKNOWN)
  })

  test('returns unknown for empty string filename', async () => {
    const result = getFileType('')
    expect(result).toMatchObject(UNKNOWN)
  })
})
