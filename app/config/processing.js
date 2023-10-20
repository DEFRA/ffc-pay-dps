const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  pollingInterval: Joi.number().default(10000), // 10 seconds
  maxProcessingTries: Joi.number().default(3),
  useV2Events: Joi.boolean().default(true),
  pollingActive: Joi.boolean().default(true)
})

// Build config
const config = {
  pollingInterval: process.env.POLLING_INTERVAL,
  maxProcessingTries: process.env.MAX_PROCESSING_TRIES,
  useV2Events: process.env.USE_V2_EVENTS,
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
