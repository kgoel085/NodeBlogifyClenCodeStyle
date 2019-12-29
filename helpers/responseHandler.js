module.exports = (statusCode = 500, error = true, otherInfo) => {
  const returnObj = {}
  returnObj.statusCode = (!statusCode) ? 500 : statusCode

  if (error === true) {
    returnObj.error = true
    otherInfo.data = otherInfo.message

    // Throw error
    // const err = new Error(otherInfo.message)
    // err.statusCode = returnObj.statusCode
    // err.error = true
    throw otherInfo
  } else returnObj.success = true

  return { ...returnObj, data: otherInfo.data, ...otherInfo }
}
