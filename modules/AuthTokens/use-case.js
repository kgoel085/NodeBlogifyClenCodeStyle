const CRUD = require('./../../services/CRUD')
// const { InvalidParam, UniqueConstraint } = require('./../../helpers/error')
// const { validateObjectId, isArray, isRequired, isType } = require('./../../helpers')

class AuthToken extends CRUD {
  constructor (db = null, schema = null) {
    super(db, 'category', schema)
  }
}

module.exports = AuthToken
