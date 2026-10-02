const { databaseConfig: dbConfig } = require('./config')
const { Database } = require('ffc-database')
const TABLES = require('./constants/tables')

const database = new Database({ ...dbConfig, tables: TABLES })
const db = database.connect()

module.exports = db
