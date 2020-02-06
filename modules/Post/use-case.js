const CRUD = require('./../../services/CRUD')
const { UniqueConstraint, InvalidParam } = require('./../../helpers/error')
const { isType } = require('./../../helpers')

class Post extends CRUD {
  constructor (db = null, schema = null, category = null) {
    super(db, 'posts', schema)
    this.category = category // Category Model
  }

  // Create category
  async createPost (obj = {}) {
    obj = this.schema(obj, true)

    // Validate values
    const { name, category } = obj

    // Validate & check for post name existence
    const { data: nameExists } = await this.checkForValue(name, 'name', false, true)
    if (nameExists) throw new UniqueConstraint(`Post with name (${name}) already exists !`)

    // Validate & check for categories
    await this.validatePostCategories(category)

    const result = await this.insert(obj)
    return result
  }

  // Validate & check provided categories are valid or not
  async validatePostCategories (catArr = []) {
    isType('array', catArr, 'category', true)

    const returnVal = []
    for (const category of catArr) {
      const { data } = await this.category.checkCategory(category, true)
      if (!data) throw new InvalidParam('Invalid category provided !')

      returnVal.push(data)
    }

    return returnVal
  }
}

module.exports = Post
