const validateSchema = require('./../../helpers/schema')

const schema = {
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
  // Validate Object
  const validObj = validateSchema(schema, userObj)
  return validObj
}
