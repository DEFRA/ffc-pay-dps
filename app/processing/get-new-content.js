const { DPS } = require('../constants/file-types')
const { getContent: getDPSContent } = require('./dps/get-content')

const getNewContent = (paymentRequests, fileType) => {
  let rows = []
  for (const paymentRequest of paymentRequests) {
    const content = fileType === DPS ? getDPSContent(paymentRequest) : []
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
