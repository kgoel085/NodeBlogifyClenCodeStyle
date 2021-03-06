const { isRequired, isType, hasOwnProperty, isObject } = require('./../helpers')
const { RequiredParam } = require('./../helpers/error')
class Schema {
  constructor (schema = isRequired('schema'), isResponse = true) {
    isType('object', schema, 'Schema', true)
    this.schema = { ...schema, _id: { type: 'databaseId' } } // Stores the provided schema
    this.isResponse = isResponse
    this.normalizeObject = null // use this to apply any filter to the validated schema object

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
  validate (params = isRequired('params'), isResponse = false) {
    isType('object', params, 'Params', true) // Check the param type and length
    isType('boolean', isResponse, 'isResponse', true) // Check the param type and length

    this.original = params
    this.isResponse = isResponse

    this.createKeys() // Sort out keys based on their relevance
    this.filterParams() // Filter the param object
    this.checkForRequiredFields() // Perform required / guarded / hidden
    return this.validateSchema() // Validate the params against the schema
  }

  // Validate the params with stored schema
  validateSchema () {
    const validObject = this.attributes
    for (const key of Object.keys(this.schema)) {
      // Filter out the hidden / guarded attributes from response
      if (this.isResponse) {
        if (this.hidden.length > 0 && this.hidden.includes(key)) continue
      } else if (this.guarded.includes(key)) continue

      let currentVal = this.filtered[key] // Current request object value

      // Add the columns that are allowed but not have any validation
      if (!isObject(this.schema[key]) || this.schema[key] === undefined) {
        if (currentVal && currentVal !== undefined) validObject[key] = currentVal
        continue
      }

      // Check if correct type is received or not
      let { required, type, default: defaultVal, valueType } = this.schema[key]
      if (typeof required === 'undefined' || required === null) required = false

      if (type) {
        if (required === true) currentVal = isType(type, currentVal, key, true) // Check value if required
        else if (!this.checkForValidDefaultVal(currentVal, key)) { // If value is not present
          if (this.checkForValidDefaultVal(defaultVal, key)) currentVal = defaultVal // Check for default value, possible: null, false, !undefined
          else continue
        }

        // Validate values of the current value if applicable
        if (valueType) this.validateValueType(valueType, key, currentVal, required)

        validObject[key] = currentVal
      }
    }

    // Reset everything
    const returnObj = { ...validObject }
    this.reset()

    // Use this function to perform any modifications to final return object
    if (this.normalizeObject && typeof this.normalizeObject === 'function') return this.normalizeObject(returnObj)

    // Returns the final filtered response / schema structure
    return returnObj
  }

  // Filter out unwanted params
  filterParams () {
    isType('object', this.original, 'Params', true)

    const schemaKeys = Object.keys(this.schema)
    const paramKeys = Object.keys(this.original)

    for (const key of paramKeys) {
      if (schemaKeys.includes(key)) this.filtered[key] = this.original[key]
      else this.unwanted.push(key)
    }
  }

  // Differentiate keys based on their relevance
  createKeys () {
    const paramsKeys = Object.keys(this.schema)
    for (const key of paramsKeys) {
      if (!isObject(this.schema[key])) continue

      const { required, guarded, hidden } = this.schema[key]
      if (guarded && !this.guarded.includes(key)) this.guarded.push(key)
      if (hidden && !this.hidden.includes(key)) this.hidden.push(key)
      if (required) { // After adding required field, then continue
        if (!this.required.includes(key)) this.required.push(key)
        continue
      }
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

  // Validate if value type is correct or not, for array or objects
  validateValueType (type = null, lbl = null, val = null, checkVal = true) {
    if (isType('array', val, lbl, checkVal)) this.validateArrayValues(type, lbl, val) // Validate array values
  }

  // Validate if array has the defined value type
  validateArrayValues (type = null, lbl = null, val = null) {
    for (const key of val) isType(type, key, lbl)
  }

  // Reset everything
  reset () {
    // Reset attribute objects
    this.original = {}
    this.filtered = {}
    this.attributes = {}

    // Reset attribute keys
    this.keys = []
    this.required = []
    this.guarded = []
    this.hidden = []
    this.unwanted = []
  }
}

module.exports = Schema
