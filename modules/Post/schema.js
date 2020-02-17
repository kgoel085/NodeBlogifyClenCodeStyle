const { normalizeString } = require('../../helpers')
const SchemaClass = require('./../../services/Schema')

const fields = {
  name: {
    type: 'string',
    required: true
  },
  category: {
    type: 'array',
    required: true,
    valueType: 'databaseId'
  },
  content: {
    type: 'base64',
    required: true
  },
  tags: {
    type: 'array',
    default: [],
    valueType: 'databaseId'
  },
  createdBy: {
    type: 'databaseId',
    required: true,
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
  }
}

const normalizeObj = ({
  name,
  ...otherInfo
} = {}) => {
  name = normalizeString(name, 1)
  return {
    name,
    ...otherInfo
  }
}

const Schema = new SchemaClass(fields)
Schema.normalizeObject = normalizeObj

module.exports = (postObj, isResponse = false) => Schema.validate(postObj, isResponse)
