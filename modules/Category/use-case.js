const CRUD = require('./../../services/CRUD')
const { InvalidParam, UniqueConstraint } = require('./../../helpers/error')
const { validateObjectId, isArray, isRequired, isType } = require('./../../helpers')

class Category extends CRUD {
  constructor (db = null, schema = null) {
    super(db, 'category', schema)
  }

  // Create category
  async createCategory (obj = {}) {
    obj = this.schema(obj, true)
    const { category, isChild } = obj

    // Check whether category already exists or not
    const { data } = await this.checkCategory(category)
    if (data) throw new UniqueConstraint(`Category (${category}) already exists `)

    // If category said to be a child, check that parent exists or not
    if (isChild) {
      const { data: parentData } = await this.checkCategory(isChild, true)
      if (!parentData) throw new InvalidParam(`Invalid parent is assigned to ${category} category`)
    }

    const result = await this.insert(obj)
    return result
  }

  // Check whether category already exists or not
  async checkCategory (category = false, isId = false) {
    const result = await this.checkForValue(category, 'category', isId, true)
    return result
  }

  // Get all categories
  async getCategories (id = null, getChild = true, cb = null) {
    try {
      const categoryData = await this.fetchCategories(id, false, getChild, cb)
      const data = (isArray(categoryData, true)) ? categoryData : false

      const returnData = { data, statusCode: 200, success: true, msg: 'Categories found' }
      if (!data) returnData.msg = 'No categories found !'

      return returnData
    } catch (err) {
      throw new Error(err)
    }
  }

  // Get category by id
  async getCategoriesById ({ id = isRequired('id'), returnChild = false, cb = null }) {
    if (!id || !validateObjectId(id)) throw new InvalidParam('Invalid id provided !') // Category id to fetch

    // Whether to return child for category [ 0 or 1 ]
    let getChild = false
    if (returnChild && parseInt(returnChild) === 1) getChild = true

    // Category data
    const data = await this.getCategories(id, getChild, cb)
    return data
  }

  // Recursively fetch all the categories
  async fetchCategories (id = null, isChild = false, returnChild = true, cb = null) {
    const returnArr = []

    if (id) id = id.toString()
    let searchQry = { isChild: id }

    // Look for id first, if not child
    if (!isChild && id) {
      const parentId = await this.makeDbId(id)
      searchQry = { _id: parentId }
    }

    // Fetch data, if present
    const { data: parentData } = await this.findAll(searchQry)
    if (parentData && isArray(parentData, true)) {
      for (const parent of parentData) {
        const { _id } = parent
        let tmpObj = { ...parent }

        // Perform any operations on the fetched data. NOTE: Please always return the object passed as parameters
        if (cb && typeof cb === 'function') tmpObj = await cb(parent)

        // Check if child is requested or not
        if (returnChild) {
          // Fetch child categories
          const dataArr = await this.fetchCategories(_id, true, true, cb)
          if (dataArr && isArray(dataArr, true)) tmpObj = { ...tmpObj, nested: [...dataArr] }
        }

        returnArr.push(tmpObj)
      }
    }

    return returnArr
  }

  // Update category
  async updateCategory (obj = {}) {
    const { _id: categoryId, isChild, isActive, ...details } = this.schema(obj)
    if (!this.checkCategory(categoryId, true)) throw InvalidParam('Provided category is invalid !')

    // Check if child is valid or not
    if (isChild) {
      if (!validateObjectId(isChild) || !this.checkCategory(isChild, true)) throw InvalidParam('Provided child category is invalid !')
    }

    // Update data
    const updateId = await this.makeDbId(categoryId)
    const result = await this.updateOne({ _id: updateId }, { $set: { ...details, isChild } })
    return result
  }

  // Mark a category as inactive / active
  async modifyCategoryStatus (usrData = {}) {
    const { id, isActive } = usrData

    // Validate values
    if (isActive === null || isActive === 'undefined') throw new InvalidParam('isActive is invalid !')
    isType('databaseId', id, 'id', true)
    isType('boolean', isActive, 'isActive', true)

    // Check if category exists or not
    const { data } = await this.checkCategory(id, true)
    if (!data) throw new InvalidParam('Invalid category provided !')

    // Callback to be executed for every received category
    const callBack = async obj => {
      const { _id } = obj
      const catId = await this.makeDbId(_id)

      // Return the updated data
      const { success, data } = await this.updateOne({ _id: catId }, { $set: { isActive } })
      if (success && data) obj = data

      return obj
    }
    const { success, statusCode } = await this.getCategories(id, true, callBack)
    if (success && statusCode === 200) return { success, statusCode, msg: 'Category updated' }

    throw new Error('Problem processing request !')
  }
}

module.exports = Category
