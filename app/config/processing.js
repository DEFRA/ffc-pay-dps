const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  processingActive: Joi.boolean().default(true),
  pollingInterval: Joi.number().default(10000), // 10 seconds
  maxProcessingTries: Joi.number().default(3),
  useEvents: Joi.boolean().default(true),
  pollingActive: Joi.boolean().default(true)
})

// Build config
const config = {
  processingActive: process.env.PROCESSING_ACTIVE,
  pollingInterval: process.env.POLLING_INTERVAL,
  maxProcessingTries: process.env.MAX_PROCESSING_TRIES,
  useEvents: process.env.USE_EVENTS,
  pollingActive: true
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The processing config is invalid. ${result.error.message}`)
}

module.exports = result.value
