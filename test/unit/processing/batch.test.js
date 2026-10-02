const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['batches'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const batch = require('../../../app/processing/batch')

const filename = 'BGAN20230908164539C.OUT'

describe('batch', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(undefined)
  })

  describe('create', () => {
    test('inserts the batch with the file type', async () => {
      await batch.create(filename, 1)

      expect(mockDb.tables.batches).toHaveBeenCalledTimes(1)
      expect(mockDb.builder.insert).toHaveBeenCalledWith({ filename, fileTypeId: 1 })
    })

    test('rejects when the insert fails', async () => {
      const error = new Error('DB error')
      mockDb.builder.rejects(error)

      await expect(batch.create(filename, 1)).rejects.toBe(error)
    })
  })

  describe('updateStatus', () => {
    test('sets the status, processed and updated dates', async () => {
      await batch.updateStatus(filename, batch.status.success)

      expect(mockDb.builder.where).toHaveBeenCalledWith({ filename })
      expect(mockDb.builder.update).toHaveBeenCalledWith({
        statusId: batch.status.success,
        processedOn: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('incrementProcessingTries', () => {
    test('increments processing tries and sets updated date for the file', async () => {
      await batch.incrementProcessingTries(filename)

      expect(mockDb.builder.where).toHaveBeenCalledWith({ filename })
      expect(mockDb.builder.increment).toHaveBeenCalledWith('processingTries', 1)
      expect(mockDb.builder.update).toHaveBeenCalledWith({ updatedAt: expect.any(Date) })
    })
  })

  describe('exists', () => {
    test('returns the batch when found', async () => {
      const row = { batchId: 1, filename }
      mockDb.builder.resolves(row)

      await expect(batch.exists(filename)).resolves.toBe(row)
      expect(mockDb.builder.where).toHaveBeenCalledWith({ filename })
      expect(mockDb.builder.first).toHaveBeenCalledTimes(1)
    })

    test('returns null when not found', async () => {
      await expect(batch.exists(filename)).resolves.toBeNull()
    })
  })

  test('exposes the batch statuses', () => {
    expect(batch.status).toEqual({ inProgress: 1, success: 2, failed: 3 })
  })
})
