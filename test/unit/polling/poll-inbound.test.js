jest.mock('../../../app/data')
const mockDb = require('../../../app/data')

jest.mock('../../../app/storage')
const mockStorage = require('../../../app/storage')

jest.mock('../../../app/processing')
const mockProcessFile = require('../../../app/processing')

const mockCommit = jest.fn()
const mockRollback = jest.fn()

const { DPS } = require('../../../app/constants/file-types')

const pollInbound = require('../../../app/polling/poll-inbound')

describe('poll inbound', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.sequelize = {
      transaction: jest.fn(() => Promise.resolve({ commit: mockCommit, rollback: mockRollback }))
    }
    mockStorage.getPendingFiles = jest.fn(() => Promise.resolve([{ type: DPS, name: 'file1' }, { type: DPS, name: 'file2' }]))
  })

  test('should create a database transaction', async () => {
    await pollInbound()
    expect(mockDb.sequelize.transaction).toHaveBeenCalledTimes(1)
  })

  test('should lock the lock table', async () => {
    await pollInbound()
    expect(mockDb.lock.findByPk).toHaveBeenCalledTimes(1)
    expect(mockDb.lock.findByPk).toHaveBeenCalledWith(1, expect.objectContaining({ lock: true }))
  })

  test('should get the inbound file list', async () => {
    await pollInbound()
    expect(mockStorage.getPendingFiles).toHaveBeenCalledTimes(1)
  })

  test('should process each security file if file type matched', async () => {
    await pollInbound()
    expect(mockProcessFile).toHaveBeenCalledTimes(2)
    expect(mockProcessFile).toHaveBeenCalledWith('file1', DPS)
    expect(mockProcessFile).toHaveBeenCalledWith('file2', DPS)
  })

  test('should commit the transaction', async () => {
    await pollInbound()
    expect(mockCommit).toHaveBeenCalledTimes(1)
  })

  test('should rollback the transaction if error', async () => {
    mockStorage.getPendingFiles.mockRejectedValue(new Error('Test error'))
    await expect(pollInbound()).rejects.toThrow('Test error')
    expect(mockRollback).toHaveBeenCalledTimes(1)
  })
})
