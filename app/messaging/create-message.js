const { SOURCE } = require('../constants/source')

const createMessage = (filename, ledger) => {
  return {
    body: {
      filename,
      ledger
    },
    type: 'uk.gov.defra.ffc.pay.file.send',
    source: SOURCE
  }
}

module.exports = createMessage
