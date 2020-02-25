const SchemaClass = require('./../../services/Schema')

const fields = {
  user: {
    required: true,
    type: 'databaseId'
  },
  identifier: {
    required: true,
    type: 'string'
  },
  ip: {
    required: true,
    type: 'ip'
  },
  isActive: {
    type: 'boolean',
    default: true
  },
  createdAt: {
    type: 'date',
    default: new Date().getTime(),
    guarded: true
  },
  modifiedAt: {
    type: 'date',
    default: null,
    guarded: true
  }
}

const Schema = new SchemaClass(fields)
module.exports = (categoryObj, isResponse = false) => Schema.validate(categoryObj, isResponse)
