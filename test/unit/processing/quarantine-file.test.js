jest.mock('../../../app/storage')
const storage = require('../../../app/storage')

const quarantineFile = require('../../../app/processing/quarantine-file')
const filename = require('../../mocks/filename')

describe('quarantineFile', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test.each([
    ['filename string', filename],
    ['empty string', ''],
    ['object', {}],
    ['array', []],
    ['null', null]
  ])('should call storage.quarantineFile once with %s', async (_, input) => {
    await quarantineFile(input)
    expect(storage.quarantineFile).toHaveBeenCalledTimes(1)
    expect(storage.quarantineFile).toHaveBeenCalledWith(input)
  })

  test('should return true when storage.quarantineFile returns true', async () => {
    storage.quarantineFile.mockReturnValue(true)
    const result = await quarantineFile(filename)
    expect(result).toBe(true)
  })

  test('should return false when storage.quarantineFile returns false', async () => {
    storage.quarantineFile.mockReturnValue(false)
    const result = await quarantineFile(filename)
    expect(result).toBe(false)
  })
})
