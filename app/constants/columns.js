const TABLES = require('./tables')

const PRIMARY_KEYS = {
  [TABLES.batches]: 'batchId',
  [TABLES.customers]: 'customerId'
}

const COLUMNS = {
  [TABLES.batches]: [
    'batchId',
    'filename',
    'fileTypeId',
    'statusId',
    'processedOn',
    'createdAt',
    'updatedAt',
    'processingTries'
  ],
  [TABLES.customers]: [
    'customerId',
    'trader',
    'frn'
  ],
  [TABLES.fileTypes]: [
    'fileTypeId',
    'fileType'
  ],
  [TABLES.locks]: [
    'lockId'
  ],
  [TABLES.statuses]: [
    'statusId',
    'status'
  ]
}

const pickColumns = (record, table) => {
  return Object.fromEntries(
    Object.entries(record)
      .filter(([column]) => COLUMNS[table].includes(column))
      .filter(([column]) => column !== PRIMARY_KEYS[table])
  )
}

module.exports = {
  PRIMARY_KEYS,
  COLUMNS,
  pickColumns
}
