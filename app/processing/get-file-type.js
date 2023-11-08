const { DPS, DAX, UNKNOWN } = require('../constants/file-types')

const getFileType = (filename) => {
  if (!filename || typeof filename !== 'string' || !filename.startsWith('BGAN')) {
    return UNKNOWN
  }

  if (filename.endsWith('.OUT')) {
    return DPS
  }

  if (filename.endsWith('.ack')) {
    return DAX
  }

  return UNKNOWN
}

module.exports = getFileType
