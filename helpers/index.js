const { RequiredParam, InvalidParam } = require('./error')
module.exports = {
  // Check for required variables
  isRequired: param => {
    throw new RequiredParam(param)
  },

  // Normalize String
  normalizeString: (word, stringMatch = 0) => {
    const toCase = (stringMatch === 1) ? 'toUpperCase' : 'toLowerCase'

    if (word.length === 1) {
      return (stringMatch === 1) ? word[toCase]() : word[toCase]()
    }
    return word.charAt(0)[toCase]() + word.substring(1)
  },

  // Validate String
  validateString: (lbl, val = '', len = 2) => {
    if (!val || typeof val !== 'string') throw new InvalidParam(`${lbl} is invalid`)
    if (val.length < 2) throw new InvalidParam(`${lbl} length should be at least 2 characters`)

    return val
  },

  // Validate Integer
  validateInt: (lbl, val = 0) => {
    if (typeof val !== 'number' || parseInt(val) < 0) throw new InvalidParam(`${lbl} should be an integer`)
    return val
  },

  // Validate Email
  validateEmail: (lbl, val = '') => {
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (filter.test(val)) return val

    throw new InvalidParam(`${val} is not a valid email`)
  },

  // Check if is array
  isArray: (varObj, chkLength = false) => {
    let returnVal = false
    if ((!!varObj) && (varObj.constructor === Array)) returnVal = true
    if (returnVal && chkLength && varObj.length === 0) returnVal = false

    return returnVal
  },

  // Check if is object
  isObject: (varObj, chkLength = false) => {
    let returnVal = false
    if ((!!varObj) && (varObj.constructor === Object)) returnVal = true
    if (returnVal && chkLength && Object.keys(varObj).length === 0) returnVal = false

    return returnVal
  },

  // Check if object has a property available
  hasOwnProperty: (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
  }
}
