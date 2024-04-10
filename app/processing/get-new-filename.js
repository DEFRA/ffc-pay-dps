const { DAX } = require('../constants/file-types')

const getNewFileName = (filename, fileType) => {
  if (fileType === DAX) {
    return filename
  }
  return `FFC${filename.slice(0, -4)}.csv`
}

module.exports = {
  getNewFileName
}
