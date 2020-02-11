const schema = require('./schema')
const db = require('../../loaders/database')
const Tag = require('./use-case')

module.exports = new Tag(db(), schema)
