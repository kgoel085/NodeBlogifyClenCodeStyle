const schema = require('./schema')
const Role = require('./use-case')
const db = require('./../../loaders/database')

module.exports = new Role(db(), schema)
