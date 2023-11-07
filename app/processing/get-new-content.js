const { DPS } = require('../constants/file-types')
const { getDPSContent } = require('./dps/get-dps-content')
const { getDAXContent } = require('./dax/get-dax-content')

const getNewContent = (securityRequests, fileType) => {
  let rows = []
  for (const securityRequest of securityRequests) {
    const content = (fileType === DPS) ? getDPSContent(securityRequest) : getDAXContent(securityRequest)
    rows = rows.concat(content)
  }
  return rows
}

module.exports = {
  getNewContent
}
