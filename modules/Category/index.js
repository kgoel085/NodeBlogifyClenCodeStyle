const schema = require('./schema')
const Category = require('./use-case')
const db = require('../../loaders/database')

module.exports = new Category(db(), schema)
