const CRUD = require('./../../services/CRUD')
const { InvalidParam, UniqueConstraint } = require('./../../helpers/error')
const { validateObjectId } = require('./../../helpers')

class Category extends CRUD {
  constructor (db = null, schema = null) {
    super(db, 'category', schema)
  }

  // Create category
  async createCategory (obj = {}) {
    obj = this.schema(obj)
    const { category, isChild } = obj

    // Check whether category already exists or not
    const { data } = await this.checkCategory(category)
    if (data) throw new UniqueConstraint(`Category (${category}) already exists `)

    // If category said to be a child, check that parent exists or not
    const { data: parentData } = await this.checkCategory(isChild, true)
    if (!parentData) throw new InvalidParam(`Invalid parent is assigned to ${category} category`)

    const result = await this.insert(obj)
    return result
  }

  // Check whether category already exists or not
  async checkCategory (category = false, isId = false) {
    if (!category) throw new InvalidParam('Category is invalid !')
    let result

    // If passed argument is a id
    if (isId) {
      if (!validateObjectId(category)) throw new InvalidParam('Parent category is invalid !')
      result = await this.findById(category)
      return result
    }

    category = new RegExp('^' + category, 'i')
    result = await this.findOne({ category })
    return result
  }
}

module.exports = Category
