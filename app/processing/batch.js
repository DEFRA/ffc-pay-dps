const { batches } = require('../database')

const create = async (filename, fileTypeId) => {
  await batches().insert({ filename, fileTypeId })
}

const updateStatus = async (filename, statusId) => {
  const now = new Date()
  await batches().where({ filename }).update({ statusId, processedOn: now, updatedAt: now })
}

const incrementProcessingTries = async (filename) => {
  await batches().where({ filename }).increment('processingTries', 1).update({ updatedAt: new Date() })
}

const exists = async (filename) => {
  return (await batches().where({ filename }).first()) ?? null
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
