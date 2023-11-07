const { DAX } = require('../../../../app/constants/file-types')
const { transformLine } = require('../../../../app/processing/dax/transform-line')
const filename = require('../../../mocks/filename')

const batchLine = ['010540', '010540', '1RB13915', 'Yes', 'GT0362947', 'Transfer of goods', 'Yes']

describe('Transform DAX line', () => {
  test('returns correlationId', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.correlationId).not.toBe(null)
  })

  test('returns batch', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.batch).toBe(filename.DAX)
  })

  test('returns fileTypeId of DAX ID', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.fileTypeId).toBe(DAX.fileTypeId)
  })

  test('returns primaryTrader', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.primaryTrader).toBe('010540')
  })

  test('returns usedByTrader', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.usedByTrader).toBe('010540')
  })

  test('returns reference', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.reference).toBe('1RB13915')
  })

  test('returns loaded', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.loaded).toBe('Yes')
  })

  test('returns daxReference', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.daxReference).toBe('GT0362947')
  })

  test('returns reason', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.reason).toBe('Transfer of goods')
  })

  test('returns posted', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.posted).toBe('Yes')
  })

  test('returns correlationId even if batchLine is empty', async () => {
    const result = transformLine([], filename.DAX)
    expect(result.correlationId).not.toBe(null)
  })

  test('returns batch even if batchLine is empty', async () => {
    const result = transformLine([], filename.DAX)
    expect(result.batch).toBe(filename.DAX)
  })
})
