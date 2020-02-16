const schema = require('./schema')
const db = require('../../loaders/database')
const Post = require('./use-case')

// Dependencies
const Category = require('./../Category') // Category Module
const Tag = require('./../Tag') // Tag module

module.exports = new Post(db(), schema, Category, Tag)
