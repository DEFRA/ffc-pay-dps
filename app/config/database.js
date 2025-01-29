const { DefaultAzureCredential } = require('@azure/identity')
const { PRODUCTION } = require('../constants/environments')
const portNumber = 5432
const timeout = 60000
const backoffBase = 500
const maxRetries = 10

function isProd () {
  return process.env.NODE_ENV === PRODUCTION
}

const hooks = {
  beforeConnect: async (cfg) => {
    if (isProd()) {
      const credential = new DefaultAzureCredential()
      const accessToken = await credential.getToken(
        'https://ossrdbms-aad.database.windows.net',
        { requestOptions: { timeout: 1000 } }
      )
      cfg.password = accessToken.token
    }
  }
}

const retry = {
  backoffBase,
  backoffExponent: 1.1,
  match: [/SequelizeConnectionError/],
  max: maxRetries,
  name: 'connection',
  timeout
}

const config = {
  database: process.env.POSTGRES_DB || 'ffc_pay_dps',
  dialect: 'postgres',
  dialectOptions: {
    ssl: isProd()
  },
  hooks,
  host: process.env.POSTGRES_HOST || 'ffc-pay-dps-postgres',
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || portNumber,
  logging: process.env.POSTGRES_LOGGING || false,
  retry,
  schema: process.env.POSTGRES_SCHEMA_NAME || 'public',
  username: process.env.POSTGRES_USERNAME
}

module.exports = config
