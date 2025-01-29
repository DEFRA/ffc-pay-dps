const Joi = require('joi')
const pollingInterval = 10000
const maxProcessingTries = 3

// Define config schema
const schema = Joi.object({
  pollingInterval: Joi.number().default(pollingInterval), // 10 seconds
  maxProcessingTries: Joi.number().default(maxProcessingTries),
  useEvents: Joi.boolean().default(true),
  pollingActive: Joi.boolean().default(true)
})

// Build config
const config = {
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
