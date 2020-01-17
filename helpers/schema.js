const { isType, isRequired, isObject, hasOwnProperty } = require('./index')
const { InvalidParam, RequiredParam } = require('./error')

// Filter out unwanted params sent
const filterObject = (schema, obj) => {
  const schemaKeys = Object.keys(schema)
  const filteredObj = {}

  for (const key of Object.keys(obj)) {
    if (schemaKeys.includes(key) && obj[key]) filteredObj[key] = obj[key]
  }
  return filteredObj
}

// Checks whether all the required vars are present or not
const checkRequiredVars = (schema, obj) => {
  for (const key of Object.keys(schema)) {
    if (!isObject(schema[key])) continue
    const { required } = schema[key]
    if (!required) continue

    if (!hasOwnProperty(obj, key)) throw new RequiredParam(key)
  }
}

// Validates the filtered object with schema object
const validateSchema = (schema, obj) => {
  const validObject = {}

  for (const key of Object.keys(schema)) {
    if (!isObject(schema[key])) continue
    const { required, type, default: defaultVal } = schema[key]
    let currentVal = obj[key]

    // Check if correct type is received or not
    if (type) {
      if (required === true) currentVal = isType(type, currentVal, key, true) // Check value if required
      else if (!currentVal && (defaultVal || defaultVal === null)) currentVal = defaultVal // Check if no value is present set default one
    }

    validObject[key] = currentVal
  }

  return validObject
}

module.exports = (schema = isRequired('schema'), obj = require('obj')) => {
  // Validate if an object is received or not
  isType('object', schema, 'Schema', true)
  isType('object', obj, 'Attributes', true)

  schema = { ...schema, _id: { type: 'databaseId' } }

  // Filter the object, to remove unwanted params
  const filteredObject = filterObject(schema, obj)
  if (!isObject(filteredObject, true)) throw new InvalidParam('Invalid params / No params received !')

  // Check whether required vars are present or not
  checkRequiredVars(schema, obj)

  // Validate and return
  return validateSchema(schema, filteredObject)
}
