const schema = require('./schema')
const Post = require('./use-case')
const db = require('../../loaders/database')

module.exports = new Post(db(), schema)
