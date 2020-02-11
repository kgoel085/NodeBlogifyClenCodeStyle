const CRUD = require('../../services/CRUD')
// const { UniqueConstraint, InvalidParam } = require('../../helpers/error')
// const { isType, validateObjectId } = require('../../helpers')

class Tag extends CRUD {
  constructor (db = null, schema = null) {
    super(db, 'tags', schema)
  }

  async createTag (obj = {}) {
    obj = this.schema(obj)

    console.log('Tag data: ', obj)
  }
}

module.exports = Tag
