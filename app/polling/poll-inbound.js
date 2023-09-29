const storage = require('../storage')

const pollInbound = async () => {
  const controlFiles = await storage.getPendingControlFiles()
  for (const controlFile of controlFiles) {
    try {
      console.log(`File Received: ${controlFile}`)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = pollInbound
