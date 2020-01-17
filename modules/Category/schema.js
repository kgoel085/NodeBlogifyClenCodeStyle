const { normalizeString } = require('../../helpers')
const validateSchema = require('./../../helpers/schema')

const normalizeObj = ({
  category,
  ...otherInfo
} = {}) => {
  category = normalizeString(category, 1)
  return {
    category,
    ...otherInfo
  }
}

const schema = {
  category: {
    required: true,
    type: 'string'
  },
  createdBy: {
    required: true,
    type: 'databaseId'
  },
  isActive: {
    type: 'boolean',
    default: true
  },
  createdAt: {
    type: 'date',
    default: new Date().getTime()
  },
  modifiedAt: {
    type: 'date',
    default: null
  },
  isChild: {
    default: null,
    type: 'databaseId'
  },
  nested: null
}

module.exports = categoryObj => {
  categoryObj = validateSchema(schema, categoryObj)
  const normalObj = normalizeObj(categoryObj)

  return normalObj
}
