const storage = require('../storage')
const processFile = require('../processing')
const db = require('../data')

const pollInbound = async () => {
  const transaction = await db.sequelize.transaction()
  try {
    await db.lock.findByPk(1, { transaction, lock: true })
    const files = await storage.getPendingFiles()
    for (const file of files) {
      try {
        await processFile(file.name, file.type)
      } catch (err) {
        console.error(err)
      }
    }
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

module.exports = pollInbound
