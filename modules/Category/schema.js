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
  createdBy = validateString('createdBy', createdBy)
  if (isChild) isChild = isType('string', isChild, 'isChild', true)
  return {
    category,
    createdBy,
    isActive,
    createdAt,
    modifiedAt,
    isChild,
    ...otherInfo
  }
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
