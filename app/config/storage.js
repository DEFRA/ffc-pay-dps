const Joi = require('joi')

const schema = Joi.object({
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccount: Joi.string().required(),
  dpsContainer: Joi.string().required(),
  daxContainer: Joi.string().required(),
  inboundFolder: Joi.string().required(),
  outboundFolder: Joi.string().required(),
  archiveFolder: Joi.string().required(),
  quarantineFolder: Joi.string().required(),
  useConnectionStr: Joi.boolean().default(false),
  createContainers: Joi.boolean().default(false)
})

const config = {
  connectionStr: process.env.AZURE_STORAGE_CONNECTION_STRING,
  storageAccount: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  dpsContainer: 'batch',
  daxContainer: 'dax',
  inboundFolder: 'inbound',
  outboundFolder: 'outbound',
  archiveFolder: 'archive',
  quarantineFolder: 'quarantine',
  useConnectionStr: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  createContainers: process.env.AZURE_STORAGE_CREATE_CONTAINERS
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
