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
    default: new Date().getTime()
  },
  modifiedAt: {
    type: 'date',
    default: null
  },
  isActive: {
    type: 'boolean',
    default: true
  },
  password: undefined,
  confirmPassword: undefined,
  tokens: undefined
}

module.exports = (userObj) => {
  const Schema = new SchemaClass(fields)
  // Validate Object
  const validObj = Schema.validate(userObj)
  return validObj
}
