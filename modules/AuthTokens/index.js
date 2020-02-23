const schema = require('./schema')
const AuthToken = require('./use-case')
const db = require('../../loaders/database')

module.exports = new AuthToken(db(), schema)
