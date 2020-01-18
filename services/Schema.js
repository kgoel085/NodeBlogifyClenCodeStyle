const { isRequired, isType, hasOwnProperty, isObject } = require('./../helpers')
const { RequiredParam } = require('./../helpers/error')
class Schema {
  constructor (schema = isRequired('schema')) {
    this.schema = schema // Stores the provided schema

    this.original = {} // Original attributes received object
    this.filtered = {} // Filtered attributes object
    this.attributes = {} // Stores the final validated object

    this.keys = [] // Stores the keys that we received in the params
    this.required = [] // Stores the keys that are necessary for the schema
    this.guarded = [] // Attributes that are not allowed for any modification
    this.hidden = [] // Attributes that should be hidden from world
    this.unwanted = [] // Attributes that are either not allowed / unwanted
  }

  // Init the class properties
  init (params = isRequired('params')) {
    isType('object', params, 'Params', true) // Check the param type and length
    this.original = params

    this.filterParams() // Filter the param object
    this.checkForRequiredFields() // Perform required / guarded / hidden ccs
    return this.validateSchema() // Validate the params against the schema
  }

  // Validate the params with stored schema
  validateSchema () {
    const validObject = {}

    for (const key of Object.keys(this.filtered)) {
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
          if ((defaultVal && defaultVal !== undefined) || defaultVal === null || defaultVal === false || defaultVal === 0) currentVal = defaultVal // Check for default value, possible: null, false, !undefined
          else continue
        }
      }
      validObject[key] = currentVal
    }

    return validObject
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

    this.createKeys() // Sort out keys based on their relevance
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
}

module.exports = Schema
