const jsonwebtoken = require('jsonwebtoken')
const { secret, expiryTime } = require('./../config')
const { getNameSpaceItem, encryptData, decryptData } = require('./../helpers')

const jwtObj = {
  // Generate a random identifier
  getUniqueIdentifer: () => require('uuid/v4')(),

  // Generate new token
  generate: (data = {}, options = {}, getRefreshToken = false) => {
    const returnArr = {}
    if (getRefreshToken) { // If refresh token is requested, generate & send it back
      jwtObj.generateRefreshToken()
    }
    returnArr.token = jsonwebtoken.sign({ ...data }, secret, { ...options, expiresIn: expiryTime }) // Generate JWT token
    return returnArr
  },

  // Verify token
  verify: (data = false) => jsonwebtoken.verify(data, secret),

  // Decode token
  decode: token => jsonwebtoken.decode(token),

  // Generate Refresh token
  generateRefreshToken: () => {
    const uuid = jwtObj.getUniqueIdentifer() // Refresh token identifier
    const { _id: userId } = getNameSpaceItem('user') // Logged in user
    const ReqIp = getNameSpaceItem('IP') // Request / Client IP

    const finalData = JSON.stringify({ uuid, ReqIp, userId: userId.toString() })
    console.log('Test Refresh token values: ', finalData, encryptData(finalData), decryptData(encryptData(finalData)))
  }
}

module.exports = jwtObj
