const Schema = require('./schema')
const Model = require('./use-case')
const Db = require('./../../loaders/database')
const Encrypt = require('./../../services/Encryption')
const JWT = require('./../../services/JWT')

module.exports = new Model(Db(), Schema, Encrypt, JWT)
