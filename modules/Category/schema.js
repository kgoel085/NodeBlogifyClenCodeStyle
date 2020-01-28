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
    type: 'databaseId',
    guarded: true
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
  },
  isChild: {
    default: null,
    type: 'databaseId'
  },
  nested: {
    type: false,
    guarded: true
  }
}

const Schema = new SchemaClass(fields)
Schema.normalizeObject = normalizeObj

module.exports = (categoryObj, isResponse = false) => Schema.validate(categoryObj, isResponse)
