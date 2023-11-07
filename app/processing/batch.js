const db = require('../data')

const create = async (filename, fileTypeId) => {
  await db.batch.create({ filename, fileTypeId })
}

const updateStatus = async (filename, statusId) => {
  await db.batch.update({ statusId, processedOn: Date.now() }, { where: { filename } })
}

const incrementProcessingTries = async (filename) => {
  await db.batch.increment('processingTries', { by: 1, where: { filename } })
}

const exists = async (filename) => {
  return db.batch.findOne({ where: { filename } })
}

module.exports = {
  create,
  updateStatus,
  exists,
  incrementProcessingTries,
  status: {
    inProgress: 1,
    success: 2,
    failed: 3
  }
}
