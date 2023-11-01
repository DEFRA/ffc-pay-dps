const { transformLine } = require('../../../../app/processing/dax/transform-line')
const filename = require('../../../mocks/filename')

const batchLine = ['010540', '010540', '1RB13915', 'Yes', 'GT0362947', '', 'Yes']

describe('Transform DAX line', () => {
  test('returns correlationId', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.correlationId).not.toBe(null)
  })

  test('returns batch', async () => {
    const result = transformLine(batchLine, filename.DAX)
    expect(result.batch).toBe(filename.DAX)
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
