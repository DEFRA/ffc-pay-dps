const mockStorage = {
  getFile: jest.fn()
}
jest.mock('../../../app/storage', () => mockStorage)

const mockRetry = jest.fn()
jest.mock('../../../app/retry', () => mockRetry)

describe('get file', () => {
  const filename = 'test.csv'
  const fileContent = 'test content'

  beforeEach(() => {
    jest.clearAllMocks()
    mockStorage.getFile.mockResolvedValue(fileContent)
    mockRetry.mockImplementation(fn => fn())
  })

  test('calls storage with filename', async () => {
    const getFile = require('../../../app/processing/get-file')
    await getFile(filename)
    expect(mockStorage.getFile).toHaveBeenCalledWith(filename)
  })

  test('uses retry functionality', async () => {
    const getFile = require('../../../app/processing/get-file')
    await getFile(filename)
    expect(mockRetry).toHaveBeenCalledTimes(1)
  })

  test('returns content in expected format', async () => {
    const getFile = require('../../../app/processing/get-file')
    const result = await getFile(filename)
    expect(result).toEqual({ content: fileContent })
  })

  test('throws error if storage fails', async () => {
    const error = new Error('Storage error')
    mockStorage.getFile.mockRejectedValue(error)
    const getFile = require('../../../app/processing/get-file')
    await expect(getFile(filename)).rejects.toThrow(error)
  })
})
