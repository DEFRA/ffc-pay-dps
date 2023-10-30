const joi = require('joi')
const { PRODUCTION } = require('../constants/environments')

const schema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object(),
    username: joi.string(),
    password: joi.string()
  },
  eventsTopic: {
    address: joi.string()
  }
})
const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === PRODUCTION,
    type: 'Topic',
    appInsights: process.env.NODE_ENV === PRODUCTION ? require('applicationinsights') : undefined,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  },
  eventsTopic: {
    address: process.env.EVENT_TOPIC_ADDRESS
  }
}

const result = schema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The message queue config is invalid. ${result.error.message}`)
}

const eventsTopic = { ...result.value.messageQueue, ...result.value.eventsTopic }

module.exports = {
  eventsTopic
}
