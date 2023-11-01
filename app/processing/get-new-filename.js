const { DAX } = require('../constants/file-types')

const getNewFileName = (filename, fileType) => {
  if (fileType === DAX) {
    return filename
  }
  return `${filename.slice(0, -4)}.csv`
}

module.exports = {
  getNewFileName
}
