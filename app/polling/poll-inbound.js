const storage = require('../storage')
const processFile = require('../processing')
const db = require('../database')

const pollInbound = async () => {
  const transaction = await db.transaction()
  try {
    await db.locks(transaction ?? undefined).where({ lockId: 1 }).forUpdate().first()
    const files = await storage.getPendingFiles()
    for await (const file of files) {
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
