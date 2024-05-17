const { readDAXFile } = require('../../../../app/processing/dax/read-dax-file')
const { transformLine } = require('../../../../app/processing/dax/transform-line')
const EventEmitter = require('events')

jest.mock('../../../../app/processing/dax/transform-line')

describe('readDAXFile', () => {
  test('processes lines and resolves the promise with the expected result', async () => {
    const mockReadBatchLines = new EventEmitter()
    mockReadBatchLines.close = jest.fn()
    const mockInput = {
      destroy: jest.fn()
    }
    const filename = 'testfile'
    transformLine.mockReturnValue('transformed line')

    const promise = readDAXFile(mockReadBatchLines, mockInput, filename)

    mockReadBatchLines.emit('line', 'test,line')
    mockReadBatchLines.emit('close')

    const result = await promise

    expect(result).toEqual({ securityRequests: ['transformed line'] })
    expect(mockReadBatchLines.close).toHaveBeenCalled()
    expect(mockInput.destroy).toHaveBeenCalled()
  })
})
