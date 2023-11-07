const { SOURCE } = require('../constants/source')

function createReturnMessage (body, filename) {
  body.fileName = filename
  return {
    body,
    type: 'uk.gov.defra.ffc.pay.return',
    source: SOURCE
  }
}

module.exports = createReturnMessage
