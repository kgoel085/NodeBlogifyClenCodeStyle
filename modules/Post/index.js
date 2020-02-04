const schema = require('./schema')
const db = require('../../loaders/database')
const Post = require('./use-case')

// Dependencies
const Category = require('./../Category')

module.exports = new Post(db(), schema, Category)
