const { SOURCE } = require('../constants/source')

function createSubmissionMessage (filename, ledger) {
  return {
    body: {
      filename,
      ledger
    },
    type: 'uk.gov.defra.ffc.pay.file.send',
    source: SOURCE
  }
}

module.exports = createSubmissionMessage
