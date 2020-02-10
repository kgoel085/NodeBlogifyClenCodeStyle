const CRUD = require('./../../services/CRUD')
const { UniqueConstraint, InvalidParam } = require('./../../helpers/error')
const { isType, validateObjectId } = require('./../../helpers')

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

  // Update post
  async updatePost (obj = {}) {
    obj = this.schema(obj)

    const { isActive, name, category, _id: postId, ...details } = obj

    // Validate name
    isType('string', name, 'Post name', true)
    isType('boolean', isActive, 'isActive', true)

    // Validate & check for post id existence
    const { data } = await this.getPostById(postId)
    if (!data) throw InvalidParam('Invalid post id provided !')

    // Validate & check for categories
    await this.validatePostCategories(category)

    // Update data
    const updateId = await this.makeDbId(postId)
    const result = await this.updateOne({ _id: updateId }, { $set: { name, category, ...details, isActive } })
    return result
  }

  // Get post details by id
  async getPostById (id = null) {
    if (!id || !validateObjectId(id)) throw new InvalidParam('Invalid id provided !') // Post id to fetch

    // Post data
    const result = await this.findById(id)
    if (!result.data) result.msg = 'No data found !'

    return result
  }

  // Get all posts assigned to a category
  async getCategoryPost (categoryId = null) {
    if (!categoryId || !validateObjectId(categoryId)) throw new InvalidParam('Invalid category provided !') // Post id to fetch
    await this.validatePostCategories([categoryId])

    const result = await this.findAll({ category: { $all: [[categoryId]] } })
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
