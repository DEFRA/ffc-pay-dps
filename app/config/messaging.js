const Joi = require('joi')
const { PRODUCTION } = require('../constants/environments')

const schema = Joi.object({
  messageQueue: {
    host: Joi.string().default('localhost'),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object(),
    username: Joi.string(),
    password: Joi.string(),
    managedIdentityClientId: Joi.string().optional()
  },
  submitTopic: {
    address: Joi.string()
  },
  eventsTopic: {
    address: Joi.string()
  },
  customerSubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().allow('subscription')
  }
})

const config = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === PRODUCTION,
    appInsights: process.env.NODE_ENV === PRODUCTION ? require('applicationinsights') : undefined,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    managedIdentityClientId: process.env.AZURE_CLIENT_ID
  },
  submitTopic: {
    address: process.env.FILESEND_TOPIC_ADDRESS
  },
  eventsTopic: {
    address: process.env.EVENT_TOPIC_ADDRESS
  },
  customerSubscription: {
    address: process.env.CUSTOMER_SUBSCRIPTION_ADDRESS,
    topic: process.env.CUSTOMER_TOPIC_ADDRESS,
    type: 'subscription'
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The message queue config is invalid. ${result.error.message}`)
}

const customerSubscription = { ...result.value.messageQueue, ...result.value.customerSubscription }
const eventsTopic = { ...result.value.messageQueue, ...result.value.eventsTopic }
const submitTopic = { ...result.value.messageQueue, ...result.value.submitTopic }

module.exports = {
  customerSubscription,
  eventsTopic,
  submitTopic
}
