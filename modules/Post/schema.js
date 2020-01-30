const Schema = require('./../../services/Schema')
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

const PostSchema = new Schema(fields)
module.exports = postObj => PostSchema.validate(postObj)
