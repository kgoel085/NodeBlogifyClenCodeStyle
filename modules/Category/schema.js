const { normalizeString } = require('../../helpers')
const SchemaClass = require('./../../services/Schema')

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

const fields = {
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
  const Schema = new SchemaClass(fields)
  categoryObj = Schema.validate(categoryObj)
  const normalObj = normalizeObj(categoryObj)

  return normalObj
}
