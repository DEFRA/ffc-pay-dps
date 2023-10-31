const { DPS } = require('../constants/file-types')
const { getContent: getDPSContent } = require('./dps/get-content')

const getNewContent = (securityRequests, fileType) => {
  let rows = []
  for (const securityRequest of securityRequests) {
    const content = fileType === DPS ? getDPSContent(securityRequest) : []
    if (fileType !== DPS) {
      console.log('DAX flow not yet implemented')
    }
    rows = rows.concat(content)
  }
  return rows
}

module.exports = {
  getNewContent
}
