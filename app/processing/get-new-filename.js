const { DPS } = require('../constants/file-types')

const getNewFileName = (filename, fileType) => {
  if (fileType === DPS) {
    return `${filename.slice(0, -4)}.csv`
  } else {
    console.log('DAX flow not yet completed')
    return filename
  }
}

module.exports = {
  getNewFileName
}
