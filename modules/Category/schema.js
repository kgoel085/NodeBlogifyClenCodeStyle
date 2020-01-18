const { normalizeString } = require('../../helpers')
// const validateSchema = require('./../../helpers/schema')
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

const Schema = new SchemaClass(fields)
module.exports = categoryObj => {
  // categoryObj = validateSchema(schema, categoryObj)
  categoryObj = Schema.init(categoryObj)
  const normalObj = normalizeObj(categoryObj)

  return normalObj
}
