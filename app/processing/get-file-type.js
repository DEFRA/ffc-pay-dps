const { DPS, DAX, UNKNOWN } = require('../constants/file-types')

const getFileType = (filename) => {
  if (!filename || typeof filename !== 'string') {
    return UNKNOWN
  }

  if (filename.startsWith('BGAN') && filename.endsWith('.OUT')) {
    return DPS
  }

  if (filename.startsWith('FFCBGAN') && filename.endsWith('.ack')) {
    return DAX
  }

  return UNKNOWN
}

module.exports = getFileType
