const CRUD = require('./../../services/CRUD')

class Post extends CRUD {
  constructor (db = null, schema = null, category = null) {
    super(db, 'posts', schema)
    this.category = category // Category Model
  }

  // Create category
  async createPost (obj = {}) {
    obj = this.schema(obj)
    return obj
  }
}

module.exports = Post
