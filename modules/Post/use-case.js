const CRUD = require('./../../services/CRUD')

class Post extends CRUD {
  constructor (db = null, schema = null) {
    super(db, 'posts', schema)
  }
}

module.exports = Post
