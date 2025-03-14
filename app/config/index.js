const storageConfig = require('./storage')
const databaseConfig = require('./database')
const processingConfig = require('./processing')
const messagingConfig = require('./messaging')
const serverConfig = require('./server')

module.exports = {
  storageConfig,
  databaseConfig,
  processingConfig,
  messagingConfig,
  serverConfig
}
