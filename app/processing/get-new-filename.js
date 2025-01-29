const { DAX } = require('../constants/file-types')
const removeFileType = 3
const startIndex = 0
const removeExtension = -4

const getNewFileName = (filename, fileType) => {
  if (fileType === DAX) {
    return filename.substring(removeFileType)
  }
  return `FFC${filename.slice(startIndex, removeExtension)}.csv`
}

module.exports = {
  getNewFileName
}
