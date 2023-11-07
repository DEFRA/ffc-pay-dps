const retry = require('../retry')
const storage = require('../storage')

const getFile = async (filename) => {
  const content = await retry(() => storage.getFile(filename))
  return { content }
}

module.exports = getFile
