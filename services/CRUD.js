const { isArray, isObject, isRequired, hasOwnProperty, validateObjectId } = require('../helpers')
const { InvalidParam } = require('../helpers/error')
const returnResponse = require('./../helpers/responseHandler')

class CRUD {
  constructor (db, collection = isRequired('collection'), schema = isRequired('schema')) {
    this.db = db // Database Object
    this.schema = schema
    this.collection = collection
  }

  // container for response handler
  _returnResponse (statusCode, stat, data) {
    return returnResponse(statusCode, stat, data)
  }

  // Map document details to schema
  mapSchema (obj) {
    // If no result is there
    if (!isArray(obj) && !isObject(obj)) return null

    // If object is array
    if (isArray(obj)) return obj.map(item => this.schema(item, true))

    return this.schema(obj, true)
  }

  // Convert ID to Database ID
  async makeDbId (id = null) {
    if (id) {
      const db = await this.db
      const DbId = db.makeId(id)
      return DbId
    }
    return id
  }

  // Insert record
  async insert (obj) {
    try {
      const db = await this.db

      // Check var type
      if (!isArray(obj, true) && !isObject(obj, true)) throw new InvalidParam('Invalid parameters provided')

      // If array is there, switch to insertMany
      const insert = (isArray(obj)) ? 'insertMany' : 'insertOne'

      const insertResult = await db.collection(this.collection)[insert](obj)
      const { ops, result, insertedCount } = insertResult

      let errorPresent = true
      if (result.ok === 1) errorPresent = false

      return this._returnResponse(200, errorPresent, { data: this.mapSchema(ops), insertedCount })
    } catch (err) {
      return this._returnResponse(500, true, err)
    }
  }

  // find a single record
  async findOne (query = isRequired('query'), opts = {}) {
    try {
      const db = await this.db

      // Check var type
      if (!isObject(query) || (opts && !isObject(opts))) throw new InvalidParam('Invalid parameters provided')

      const result = await db.collection(this.collection).findOne(query, opts)
      // if (!result || result === false) throw new Error('No data found')

      return this._returnResponse(200, false, { data: this.mapSchema(result) })
    } catch (err) {
      return this._returnResponse(500, true, err)
    }
  }

  // find a single record by it's ID
  async findById (id = isRequired('id'), opts = {}) {
    try {
      const db = await this.db
      const DbId = await this.makeDbId(id)

      // Check var type
      if (!DbId || (opts && !isObject(opts))) throw new InvalidParam('Invalid parameters provided')

      const result = await db.collection(this.collection).findOne({ _id: DbId }, opts)
      // if (!result || result === false) throw new Error('No data found')

      return this._returnResponse(200, false, { data: this.mapSchema(result) })
    } catch (err) {
      return this._returnResponse(500, true, err)
    }
  }

  // find all the records
  async findAll (query, opts = {}) {
    try {
      const db = await this.db

      // Check var type
      if (!isObject(query) || (opts && !isObject(opts))) throw new InvalidParam('Invalid parameters provided')

      const result = await db.collection(this.collection).find(query, opts).toArray()
      // if (!result || result === false) throw new Error('No data found')

      return this._returnResponse(200, false, { data: (isArray(result)) ? this.mapSchema(result) : null })
    } catch (err) {
      return this._returnResponse(500, true, err)
    }
  }

  // Find one record and update
  async updateOne (filter, updateQuery, opts) {
    try {
      const db = await this.db

      // Check var type
      if (!isObject(filter) || !isObject(updateQuery) || (opts && !isObject(opts))) throw new InvalidParam('Invalid filter provided')

      // Check and add modified timestamp
      updateQuery = this._addModifiedTime(updateQuery)

      const { result, modifiedCount, matchedCount } = await db.collection(this.collection).updateOne(filter, updateQuery, opts)
      const { nModified, ok, n: numRows } = result

      // If no matching rows found
      if (!numRows || numRows === false) throw new Error('No data found')

      let errorPresent = true
      if (ok === 1 && nModified && modifiedCount === matchedCount) errorPresent = false

      // Return latest data
      const { success, data: newUserData } = await this.findOne(filter)
      if (!success) throw new Error('Unable to fetch updated data')

      return this._returnResponse(200, errorPresent, { data: this.mapSchema(newUserData) })
    } catch (err) {
      return this._returnResponse(500, true, err)
    }
  }

  // Update all the filter matching records
  async updateAll (filter, updateQuery, opts = {}) {
    try {
      const db = await this.db

      // Check var type
      if (!isObject(filter) || !isObject(updateQuery) || (opts && !isObject(opts))) throw new InvalidParam('Invalid filter provided')

      // Check and add modified timestamp
      updateQuery = this._addModifiedTime(updateQuery)

      const { result, modifiedCount, matchedCount } = await db.collection(this.collection).updateMany(filter, updateQuery, opts)
      const { nModified, ok, n: numRows } = result

      // If no matching rows found
      if (!numRows || numRows === false) throw new Error('No data found')

      let errorPresent = true
      if (ok === 1 && nModified && modifiedCount === matchedCount) errorPresent = false

      // Return latest data
      const { success, data: newUserData } = await this.findAll(filter)
      if (!success) throw new Error('Unable to fetch updated data')

      return this._returnResponse(200, errorPresent, { data: this.mapSchema(newUserData) })
    } catch (err) {
      return this._returnResponse(500, true, err)
    }
  }

  // Delete one record
  async deleteOne (filter, opts) {
    try {
      const db = await this.db

      // Check var type
      if (!isObject(filter) || (opts && !isObject(opts))) throw new InvalidParam('Invalid filter provided')

      const deleteResult = await db.collection(this.collection).findOneAndDelete(filter, opts)
      const { value, ok } = deleteResult

      let errorPresent = true
      if (ok === 1) errorPresent = false

      return this._returnResponse(200, errorPresent, { data: this.mapSchema(value) })
    } catch (err) {
      return this._returnResponse(500, true, err)
    }
  }

  // Delete all the records
  async deleteAll (filter, opts) {
    try {
      const db = await this.db

      // Check var type
      if (!isObject(filter) || (opts && !isObject(opts))) throw new InvalidParam('Invalid filter provided')

      const deleteResult = await db.collection(this.collection).deleteMany(filter, opts)
      const { result, deletedCount } = deleteResult

      let errorPresent = true
      if (result.ok === 1) errorPresent = false

      return this._returnResponse(200, errorPresent, { deletedCount })
    } catch (err) {
      return this._returnResponse(500, true, err)
    }
  }

  // Check value exists or not in collection
  async checkForValue (val = null, col = null, isId = false, caseSensitivity = false) {
    let result = null
    const errMsg = `${col} is invalid !`

    if (val === null || val === 'undefined') throw new InvalidParam(errMsg)

    // If passed argument is a id
    if (isId) {
      if (!validateObjectId(val)) throw new InvalidParam(errMsg)
      result = await this.findById(val)
      return result
    }

    if (typeof val === 'string' && caseSensitivity) val = new RegExp('^' + val, 'i')
    const filterObj = {}
    filterObj[col] = val
    result = await this.findOne(filterObj)
    return result
  }

  // ------------------------------ Helpers ---------------------------------- //

  // Add modified timestamp to the object
  _addModifiedTime (obj) {
    const modifiedDate = new Date().getTime()

    if (hasOwnProperty(obj, '$set')) obj.$set.modifiedAt = modifiedDate
    else obj.modifiedAt = obj

    return obj
  }
}

module.exports = CRUD
