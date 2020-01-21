const { isRequired, isType, hasOwnProperty, isObject } = require('./../helpers')
const { RequiredParam } = require('./../helpers/error')
class Schema {
  constructor (schema = isRequired('schema'), isResponse = true) {
    isType('object', schema, 'Schema', true)
    this.schema = { ...schema, _id: { type: 'databaseId' } } // Stores the provided schema
    this.isResponse = isResponse

    this.original = {} // Original attributes received object
    this.filtered = {} // Filtered attributes object
    this.attributes = {} // Stores the final validated object

    this.keys = [] // Stores the keys that we received in the params
    this.required = [] // Stores the keys that are necessary for the schema
    this.guarded = [] // Attributes that are not allowed for any modification
    this.hidden = [] // Attributes that should be hidden from world
    this.unwanted = [] // Attributes that are either not allowed / unwanted
  }

  // Init the class properties & validate schema
  validate (params = isRequired('params')) {
    isType('object', params, 'Params', true) // Check the param type and length
    this.original = params

    this.createKeys() // Sort out keys based on their relevance
    this.filterParams() // Filter the param object
    this.checkForRequiredFields() // Perform required / guarded / hidden
    return this.validateSchema() // Validate the params against the schema
  }

  // Validate the params with stored schema
  validateSchema () {
    const validObject = this.attributes

    for (const key of Object.keys(this.schema)) {
      let currentVal = this.filtered[key] // Current request object value

      // Add the columns that are allowed but not have any validation
      if (!isObject(this.schema[key]) || this.schema[key] === undefined) {
        if (currentVal && currentVal !== undefined) validObject[key] = currentVal
        continue
      }

      // Check if correct type is received or not
      const { required, type, default: defaultVal } = this.schema[key]
      if (type) {
        if (required === true) currentVal = isType(type, currentVal, key, true) // Check value if required
        else if (!currentVal) { // If value is not present
          if (this.checkForValidDefaultVal(defaultVal)) currentVal = defaultVal // Check for default value, possible: null, false, !undefined
          else continue
        }

        // Filter out the hidden attributes from response
        if (this.isResponse && this.hidden.length > 0 && this.hidden.includes(key)) continue
        validObject[key] = currentVal
      }
    }

    // Use this function to perform any modifications to final return object
    this.normalizeObject(this.attributes)

    // Returns the final filtered response / schema structure
    return validObject
  }

  // Filter out unwanted params
  filterParams () {
    isType('object', this.original, 'Params', true)

    const schemaKeys = Object.keys(this.schema)
    const paramKeys = Object.keys(this.original)

    for (const key of paramKeys) {
      if (schemaKeys.includes(key) && !this.guarded.includes(key)) this.filtered[key] = this.original[key]
      else this.unwanted.push(key)
    }
  }

  // Differentiate keys based on their relevance
  createKeys () {
    const paramsKeys = Object.keys(this.schema)
    for (const key of paramsKeys) {
      if (!isObject(this.schema[key])) continue

      const { required, guarded, hidden } = this.schema[key]
      if (required) { // After adding required field, then continue
        this.required.push(key)
        continue
      }
      if (guarded) this.guarded.push(key)
      if (hidden) this.hidden.push(key)
    }
  }

  // Check whether all the required keys are present or not
  checkForRequiredFields () {
    if (this.required.length > 0) {
      for (const key of this.required) {
        if (!hasOwnProperty(this.filtered, key)) throw new RequiredParam(key)
      }
    }
  }

  // Check whether default value is valid to be assigned or not
  checkForValidDefaultVal (defaultVal = undefined) {
    return (defaultVal && defaultVal !== undefined) || defaultVal === null || defaultVal === false || defaultVal === 0
  }

  // Normalize final response before sending
  normalizeObject (attributes) {}
}

module.exports = Schema
