const joi = require('joi')
const { PRODUCTION } = require('../constants/environments')

const schema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    appInsights: joi.object(),
    username: joi.string(),
    password: joi.string()
  },
  submitTopic: {
    address: joi.string()
  },
  eventsTopic: {
    address: joi.string()
  }
})

const config = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === PRODUCTION,
    appInsights: process.env.NODE_ENV === PRODUCTION ? require('applicationinsights') : undefined,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD
  },
  submitTopic: {
    address: process.env.FILESEND_TOPIC_ADDRESS
  },
  eventsTopic: {
    address: process.env.EVENT_TOPIC_ADDRESS
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The message queue config is invalid. ${result.error.message}`)
}

const eventsTopic = { ...result.value.messageQueue, ...result.value.eventsTopic }
const submitTopic = { ...result.value.messageQueue, ...result.value.submitTopic }

module.exports = {
  eventsTopic,
  submitTopic
}
