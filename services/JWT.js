const jsonwebtoken = require('jsonwebtoken')
const { secret, expiryTime } = require('./../config')
const { getNameSpaceItem, isType } = require('./../helpers')
const { InvalidParam } = require('./../helpers/error')
const AuthToken = require('./../modules/AuthTokens')

const jwtObj = {
  // Generate a random identifier
  getUniqueIdentifer: () => require('uuid/v4')(),

  // Generate new token
  generate: async (data = {}, options = {}, getRefreshToken = false) => {
    const returnArr = {}
    const tokenIdentifier = jwtObj.getUniqueIdentifer()
    if (getRefreshToken) { // If refresh token is requested, generate & send it back
      returnArr.refresh_token = await jwtObj.generateRefreshToken(tokenIdentifier)
      data.idn = tokenIdentifier
    }
    returnArr.access_token = jsonwebtoken.sign({ ...data }, secret, { ...options, expiresIn: expiryTime }) // Generate JWT token
    return returnArr
  },

  // Verify token
  verify: (data = false) => jsonwebtoken.verify(data, secret),

  // Decode token
  decode: token => jsonwebtoken.decode(token),

  // Generate Refresh token
  generateRefreshToken: async (tokenIdentifier = null) => {
    if (!tokenIdentifier || tokenIdentifier === null) throw new InvalidParam('Unable to pass auth request !')

    const { _id: userId } = getNameSpaceItem('user') // Logged in user
    const ReqIp = getNameSpaceItem('IP') // Request / Client IP

    // Refresh auth token obj
    const tokenObj = {
      identifier: tokenIdentifier,
      user: userId.toString(),
      ip: ReqIp
    }

    // Create refresh token
    const refreshToken = await AuthToken.createToken(tokenObj)
    return refreshToken
  },

  // Check & validate refresh identifier
  checkRefreshToken: async (dataArr = {}) => {
    const validObj = isType('object', dataArr, 'Refresh Token', true, false)
    if (!validObj || validObj === null) throw new InvalidParam('Invalid refresh token !')

    const { identifier, expiry } = validObj

    // Find user by identifier & client IP
    const userByIdentifier = await AuthToken.validateRefreshToken(identifier, expiry)
    if (!userByIdentifier) throw new InvalidParam('Invalid refresh token !')

    return userByIdentifier
  }
}

module.exports = jwtObj
