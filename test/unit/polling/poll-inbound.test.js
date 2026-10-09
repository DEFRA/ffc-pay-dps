const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['locks'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

jest.mock('../../../app/storage')
const mockStorage = require('../../../app/storage')

jest.mock('../../../app/processing')
const mockProcessFile = require('../../../app/processing')

const { DPS } = require('../../../app/constants/file-types')

const pollInbound = require('../../../app/polling/poll-inbound')

describe('poll inbound', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
    mockDb.trx.commit.mockResolvedValue()
    mockDb.trx.rollback.mockResolvedValue()
    mockStorage.getPendingFiles = jest.fn(() => Promise.resolve([{ type: DPS, name: 'file1' }, { type: DPS, name: 'file2' }]))
  })

  test('should create a database transaction', async () => {
    await pollInbound()
    expect(mockDb.transaction).toHaveBeenCalledTimes(1)
  })

  test('should lock the lock table using the transaction', async () => {
    await pollInbound()
    expect(mockDb.tables.locks).toHaveBeenCalledTimes(1)
    expect(mockDb.tables.locks).toHaveBeenCalledWith(mockDb.trx)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ lockId: 1 })
    expect(mockDb.builder.forUpdate).toHaveBeenCalledTimes(1)
    expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
  })

  test('should query the lock table on the pool when no transaction is returned', async () => {
    mockDb.transaction.mockResolvedValueOnce(undefined)
    await expect(pollInbound()).rejects.toThrow(TypeError)
    expect(mockDb.tables.locks).toHaveBeenCalledWith(undefined)
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
    expect(mockDb.trx.commit).toHaveBeenCalledTimes(1)
  })

  test('should rollback the transaction if error', async () => {
    mockStorage.getPendingFiles.mockRejectedValue(new Error('Test error'))
    await expect(pollInbound()).rejects.toThrow('Test error')
    expect(mockDb.trx.rollback).toHaveBeenCalledTimes(1)
  })

  test('should rollback the transaction if the lock fails', async () => {
    mockDb.builder.rejects(new Error('Lock error'))
    await expect(pollInbound()).rejects.toThrow('Lock error')
    expect(mockDb.trx.rollback).toHaveBeenCalledTimes(1)
    expect(mockStorage.getPendingFiles).not.toHaveBeenCalled()
  })
})
