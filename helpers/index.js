const { RequiredParam, InvalidParam } = require('./error')
const sanitizeHTML = require('sanitize-html')

const helpers = {
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
  validateString: (lbl, val = '', len = 2, showErr = true) => {
    if ((!val || typeof val !== 'string') && showErr) throw new InvalidParam(`${lbl} is invalid`)
    if (val.length < 2 && showErr) throw new InvalidParam(`${lbl} length should be at least 2 characters`)

    return sanitizeHTML(val)
  },

  // Validate Integer
  validateInt: (lbl, val = 0) => {
    if (typeof val !== 'number' || parseInt(val) < 0) throw new InvalidParam(`${lbl} should be an integer`)
    return val
  },

  // Validate Email
  validateEmail: (lbl, val = '', showErr = true) => {
    // const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    const filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (filter.test(String(val).toLowerCase())) return val

    if (showErr) throw new InvalidParam(`${lbl} is not a valid email`)
  },

  // Validate Mongo DB ObjectId
  validateObjectId (str = '') {
    str = str.toString() + ''
    const len = str.length
    let valid = false
    if (len === 12 || len === 24) valid = /^[0-9a-fA-F]+$/.test(str)
    return valid
  },

  // Check if is array
  isArray: (varObj, chkLength = false) => {
    let returnVal = false
    if ((!!varObj) && (varObj.constructor === Array)) returnVal = true
    if (returnVal && chkLength && varObj.length === 0) returnVal = false

    return returnVal
  },

  // Make array unique
  isUniqueArr: (arr = []) => arr.filter((item, i, ar) => ar.indexOf(item) === i),

  // Check if is object
  isObject: (varObj, chkLength = false) => {
    let returnVal = false
    if ((!!varObj) && (varObj.constructor === Object)) returnVal = true
    if (returnVal && chkLength && Object.keys(varObj).length === 0) returnVal = false

    return returnVal
  },

  // Check if is float
  isFloat: n => Number(n) === n && n % 1 !== 0,

  // Check if is a valid date
  isDate: date => {
    return parseInt(date) && (new Date(date) !== 'Invalid Date') && !isNaN(new Date(date))
  },

  // Check if string is a valid base 64
  isBase64: str => {
    if (str instanceof Boolean || typeof str === 'boolean') {
      return false
    }

    if (str === '') return false

    let regex = '(?:[A-Za-z0-9+\\/]{4})*(?:[A-Za-z0-9+\\/]{2}==|[A-Za-z0-9+\/]{3}=)?'
    const mimeRegex = '(data:\\w+\\/[a-zA-Z\\+\\-\\.]+;base64,)'

    regex = mimeRegex + '?' + regex

    return (new RegExp('^' + regex + '$', 'gi')).test(str)
  },

  // Sanitize & Encode string to a base 64 format
  encodeBase64: str => {
    return Buffer.from(sanitizeHTML(str), 'utf-8').toString('base64')
  },

  // Sanitize & Decode string to a base 64 format
  decodeBase64: str => {
    return sanitizeHTML(Buffer.from(str, 'base64').toString('utf-8'))
  },

  // Check if object has a property available
  hasOwnProperty: (obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key)
  },

  // Check the type of the value
  isType: (type = false, value = false, lbl = false, checkVal = false, showErr = true) => {
    if (checkVal && !value && type.toLowerCase() !== 'boolean') throw new InvalidParam(`${lbl} is invalid`) // Check if value exists or not
    switch (type.toLowerCase()) {
      case 'email':
        value = helpers.validateEmail(lbl, value)
        break
      case 'array':
        if (!helpers.isArray(value, checkVal) && showErr) throw new TypeError(`${lbl} should be an array`)
        else value = helpers.isUniqueArr(value)
        break
      case 'object':
        if (!helpers.isObject(value, checkVal) && showErr) throw new TypeError(`${lbl} should be an object`)
        break
      case 'number':
      case 'integer':
        if (!value.constructor === Number && showErr) throw new TypeError(`${lbl} should be a number`)
        break
      case 'float':
      case 'decimal':
        if (!helpers.isFloat(value) && showErr) throw new TypeError(`${lbl} should be a float/decimal value`)
        break
      case 'string':
        value = helpers.validateString(lbl, value, 2, showErr)
        break
      case 'boolean':
        if (!value.constructor === Boolean && showErr) throw new TypeError(`${lbl} should be a boolean`)
        if (value !== true && value !== false && showErr) throw new InvalidParam(`${lbl} is invalid`) // Check if value exists or not
        break
      case 'databaseid':
        if (!helpers.validateObjectId(value) && showErr) throw new TypeError(`${lbl} should be a valid id`)
        break
      case 'date':
        if (!helpers.isDate(value) && showErr) throw new TypeError(`${lbl} should be a valid date`)
        value = value.toString()
        break
      case 'base64':
        if (!helpers.isBase64(value) && showErr) throw new TypeError(`${lbl} should be a valid base64 string`)
        value = helpers.encodeBase64(helpers.decodeBase64(value))
        break
    }

    return value
  }
}

module.exports = helpers
