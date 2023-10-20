jest.mock('../../../app/storage')
const storage = require('../../../app/storage')

const quarantineFile = require('../../../app/processing/quarantine-file')
const filename = require('../../mocks/filename')

describe('quarantine file', () => {
  afterEach(async () => {
    jest.resetAllMocks()
  })

  test('should call blobStorage.quarantineFile when a filename is received', async () => {
    await quarantineFile(filename)
    expect(storage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when a filename is received', async () => {
    await quarantineFile(filename)
    expect(storage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with filename when a filename is received', async () => {
    await quarantineFile(filename)
    expect(storage.quarantineFile).toHaveBeenCalledWith(filename)
  })

  test('should call blobStorage.quarantineFile when an empty string is received', async () => {
    await quarantineFile('')
    expect(storage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an empty string is received', async () => {
    await quarantineFile('')
    expect(storage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with empty string when an empty string is received', async () => {
    await quarantineFile('')
    expect(storage.quarantineFile).toHaveBeenCalledWith('')
  })

  test('should call blobStorage.quarantineFile when an object is received', async () => {
    await quarantineFile({})
    expect(storage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an object is received', async () => {
    await quarantineFile({})
    expect(storage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with object when an object is received', async () => {
    await quarantineFile({})
    expect(storage.quarantineFile).toHaveBeenCalledWith({})
  })

  test('should call blobStorage.quarantineFile when an array is received', async () => {
    await quarantineFile([])
    expect(storage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when an array is received', async () => {
    await quarantineFile([])
    expect(storage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with array when an array is received', async () => {
    await quarantineFile([])
    expect(storage.quarantineFile).toHaveBeenCalledWith([])
  })

  test('should call blobStorage.quarantineFile when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(storage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(storage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with undefined when undefined is received', async () => {
    await quarantineFile(undefined)
    expect(storage.quarantineFile).toHaveBeenCalledWith(undefined)
  })

  test('should call blobStorage.quarantineFile when null is received', async () => {
    await quarantineFile(null)
    expect(storage.quarantineFile).toHaveBeenCalled()
  })

  test('should call blobStorage.quarantineFile once when null is received', async () => {
    await quarantineFile(null)
    expect(storage.quarantineFile).toHaveBeenCalledTimes(1)
  })

  test('should call blobStorage.quarantineFile with null when null is received', async () => {
    await quarantineFile(null)
    expect(storage.quarantineFile).toHaveBeenCalledWith(null)
  })

  test('should return true when blobStorage.quarantineFile returns true', async () => {
    storage.quarantineFile.mockReturnValue(true)
    const result = await quarantineFile(filename)
    expect(result).toBe(true)
  })

  test('should return false when blobStorage.quarantineFile returns false', async () => {
    storage.quarantineFile.mockReturnValue(false)
    const result = await quarantineFile(filename)
    expect(result).toBe(false)
  })
})
