const { isRequired, validateString, isType, normalizeString } = require('../../helpers')

const validateObj = ({
  category = isRequired('category'),
  createdBy = isRequired('createdBy'),
  isActive = true,
  createdAt = new Date().getTime(),
  modifiedAt = null,
  isChild = null,
  ...otherInfo
} = {}) => {
  category = validateString('role', category)
  createdBy = isType('databaseId', createdBy, 'createdBy', true)
  isActive = isType('boolean', isActive, 'isActive')
  createdAt = isType('date', createdAt, 'createdAt', true)
  if (modifiedAt) modifiedAt = isType('date', modifiedAt, 'modifiedAt', true)
  if (isChild) isChild = isType('databaseId', isChild, 'isChild', true)

  const returnObj = {
    category,
    createdBy,
    isActive,
    createdAt,
    modifiedAt,
    isChild,
    ...otherInfo
  }
  return returnObj
}

const normalizeObj = ({
  category,
  ...otherInfo
} = {}) => {
  category = normalizeString(category, 1)
  return {
    category,
    ...otherInfo
  }
}

module.exports = categoryObj => {
  const validObj = validateObj(categoryObj)
  const normalObj = normalizeObj(validObj)

  return normalObj
}
