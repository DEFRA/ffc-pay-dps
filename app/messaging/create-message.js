const { SOURCE } = require('../constants/source')

function createMessage (body) {
  return {
    body,
    type: 'uk.gov.defra.ffc.pay.file.send',
    source: SOURCE
  }
}

module.exports = createMessage
