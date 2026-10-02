const db = require('../../../app/database')
const { truncate } = require('../../helpers/truncate')
const batch = require('../../../app/processing/batch')

const filename = 'BGAN20230908164539C.OUT'

describe('batch', () => {
  beforeEach(async () => {
    await truncate()
    await db.fileTypes().insert([{ fileTypeId: 1, fileType: 'DPS' }, { fileTypeId: 2, fileType: 'DAX' }])
    await db.statuses().insert([{ statusId: 1, status: 'In progress' }, { statusId: 2, status: 'Success' }, { statusId: 3, status: 'Failed' }])
  })

  afterAll(async () => {
    await truncate()
    await db.close()
  })

  test('create inserts the batch with the column defaults', async () => {
    await batch.create(filename, 1)

    const saved = await batch.exists(filename)
    expect(saved).toMatchObject({ filename, fileTypeId: 1, statusId: 1, processingTries: 1, processedOn: null })
    expect(saved.createdAt).toBeInstanceOf(Date)
    expect(saved.updatedAt).toBeInstanceOf(Date)
  })

  test('exists returns null when the batch is not found', async () => {
    await expect(batch.exists('missing.OUT')).resolves.toBeNull()
  })

  test('updateStatus sets the status, processedOn and updatedAt', async () => {
    const staleDate = new Date('2020-01-01T00:00:00Z')
    await batch.create(filename, 1)
    await db.batches().where({ filename }).update({ updatedAt: staleDate })

    await batch.updateStatus(filename, batch.status.success)

    const saved = await batch.exists(filename)
    expect(saved.statusId).toBe(batch.status.success)
    expect(saved.processedOn).toBeInstanceOf(Date)
    expect(saved.updatedAt.getTime()).toBeGreaterThan(staleDate.getTime())
  })

  test('incrementProcessingTries adds one to the tries and sets updatedAt', async () => {
    const staleDate = new Date('2020-01-01T00:00:00Z')
    await batch.create(filename, 1)
    await db.batches().where({ filename }).update({ updatedAt: staleDate })

    await batch.incrementProcessingTries(filename)

    const saved = await batch.exists(filename)
    expect(saved.processingTries).toBe(2)
    expect(saved.updatedAt.getTime()).toBeGreaterThan(staleDate.getTime())
  })

  test('the lock row can be selected FOR UPDATE inside a transaction', async () => {
    await db.locks().insert({ lockId: 1 })
    const trx = await db.transaction()

    const lock = await db.locks(trx).where({ lockId: 1 }).forUpdate().first()

    expect(lock).toEqual({ lockId: 1 })
    await trx.commit()
  })
})
