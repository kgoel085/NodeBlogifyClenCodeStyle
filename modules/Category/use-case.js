const CRUD = require('./../../services/CRUD')
const { InvalidParam, UniqueConstraint } = require('./../../helpers/error')
const { validateObjectId, isArray, isRequired } = require('./../../helpers')

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
    if (isChild) {
      const { data: parentData } = await this.checkCategory(isChild, true)
      if (!parentData) throw new InvalidParam(`Invalid parent is assigned to ${category} category`)
    }

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

  // Get all categories
  async getCategories (id = null, getChild = true) {
    try {
      const categoryData = await this.fetchCategories(id, false, getChild)
      const data = (isArray(categoryData, true)) ? categoryData : false

      const returnData = { data, statusCode: 200, success: true, msg: 'Categories found' }
      if (!data) returnData.msg = 'No categories found !'

      return returnData
    } catch (err) {
      throw new Error(err)
    }
  }

  // Get category by id
  async getCategoriesById ({ id = isRequired('id'), returnChild = false }) {
    if (!id || !validateObjectId(id)) throw new InvalidParam('Invalid id provided !') // Category id to fetch

    // Whether to return child for category [ 0 or 1 ]
    let getChild = false
    if (returnChild && parseInt(returnChild) === 1) getChild = true

    // Category data
    const data = await this.getCategories(id, getChild)
    return data
  }

  // Recursively fetch all the categories
  async fetchCategories (id = null, isChild = false, returnChild = true) {
    const returnArr = []

    if (id) id = id.toString()
    let searchQry = { isChild: id, isActive: true }

    // Look for id first, if not child
    if (!isChild && id) {
      const parentId = await this.makeDbId(id)
      searchQry = { _id: parentId, isActive: true }
    }

    // Fetch data, if present
    const { data: parentData } = await this.findAll(searchQry)
    if (parentData && isArray(parentData, true)) {
      for (const parent of parentData) {
        const { _id } = parent
        let tmpObj = { ...parent }

        // Check if child is requested or not
        if (returnChild) {
          // Fetch child categories
          const dataArr = await this.fetchCategories(_id, true)
          if (dataArr && isArray(dataArr, true)) tmpObj = { ...parent, nested: [...dataArr] }
        }

        returnArr.push(tmpObj)
      }
    }

    return returnArr
  }
}

module.exports = Category
