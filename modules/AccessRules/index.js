const schema = require('./schema')
const AccessRules = require('./use-case')
const db = require('./../../loaders/database')
const Role = require('./../Roles')
const Privilege = require('./../Privileges')

module.exports = new AccessRules(db(), schema, Role, Privilege)
