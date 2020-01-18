const { isRequired, isType } = require('./../helpers')

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
    this.validateSchema() // Validate the params against the schema
  }

  // Validate the params with stored schema
  validateSchema () {

  }

  // Filter out unwanted params
  filterParams () {
    isType('object', this.original, 'Params', true)

    const schemaKeys = Object.keys(this.schema)
    const paramKeys = Object.keys(this.original)

    for (const key of paramKeys) {
      if (schemaKeys.includes(key)) this.filtered[key] = this.original[key]
    }

    this.createKeys() // Sort out keys based on their relevance
  }

  // Differentiate keys based on their relevance
  createKeys () {
    const paramsKeys = Object.keys(this.filtered)
    // for (const key of paramsKeys) {

    // }
  }
}

module.exports = Schema
