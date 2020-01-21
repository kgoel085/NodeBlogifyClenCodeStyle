const SchemaClass = require('./../../services/Schema')
const fields = {
  username: {
    required: true,
    type: 'string'
  },
  email: {
    required: true,
    type: 'email'
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
  },
  isActive: {
    type: 'boolean',
    default: true
  },
  password: {
    type: 'string',
    required: true,
    hidden: true
  },
  confirmPassword: {
    type: false
  },
  tokens: {
    type: 'array',
    hidden: true,
    guarded: true
  }
}

module.exports = (userObj) => {
  const Schema = new SchemaClass(fields)
  return Schema.validate(userObj)
}
