const CRUD = require('./../../services/CRUD')
const { InvalidParam } = require('./../../helpers/error')
const { isType, encryptData, getNameSpaceItem } = require('./../../helpers')
const { tokenExpiryTime } = require('./../../config')

class AuthToken extends CRUD {
  constructor (db = null, schema = null) {
    super(db, 'auth_tokens', schema)
  }

  /**
   * Create / Update token in the DB
   * @param Object obj
   */
  async createToken (obj = {}) {
    obj = this.schema(obj, true) // Get insert object

    const { identifier, ip } = obj
    const result = await this.getUserByIdentifer(identifier, ip)

    let authTokenObj = result
    if (!authTokenObj || authTokenObj === null) { // If no data found create a new one
      const { data: authTokenRow } = await this.storeUserIdentifer(obj)
      authTokenObj = authTokenRow[0]
    }

    isType('object', authTokenObj, 'Auth Details 1', true, true) // Validate auth token obj
    return this.returnRefreshToken(authTokenObj)
  }

  /**
   * Find user with it's identifer and ip
   */
  async getUserByIdentifer (identifier = null, ip = null) {
    if (!identifier || !ip) throw new InvalidParam('Invalid auth details provided !')

    const { data } = await this.findOne({ identifier, ip, isActive: true })
    return data
  }

  /**
   * Validate refresh token
   * @param {String} identifier
   */
  async validateRefreshToken (identifier = null, expiry = null) {
    if (!identifier || identifier === null) throw new InvalidParam('Invalid refresh token !')

    // Check whether identifier is valid or not
    const identifierDetails = await this.getUserByIdentifer(identifier, getNameSpaceItem('IP'))
    if (!identifierDetails || identifierDetails === null) throw new InvalidParam('Invalid refresh token !')

    const { _id: tokenId, user } = identifierDetails
    const tokenRowId = await this.makeDbId(tokenId)

    // Check if token is expiry or not
    const currentDate = new Date().getTime()
    if (currentDate > expiry) {
      this.updateOne({ _id: tokenRowId }, { $set: { isActive: false } })
      throw new InvalidParam('Refresh token expired')
    }

    return user
  }

  /**
   * Store current token details for current user
   */
  async storeUserIdentifer (obj = {}) {
    obj = this.schema(obj, true)

    const result = await this.insert(obj)
    return result
  }

  /**
   * Return a refresh token
   */
  returnRefreshToken (data = {}) {
    isType('object', data, 'Auth Details', true, true) // Validate auth token obj

    const { identifier } = data

    if (!identifier) throw new InvalidParam('Identifer is invalid !')
    return encryptData(JSON.stringify({ identifier, expiry: this.getExpiryTime() }))
  }

  /**
   * Get expiry time
   */
  getExpiryTime () {
    const expiryIn = parseInt(tokenExpiryTime) || 60
    const expiryTime = new Date()

    return expiryTime.setDate(expiryTime.getDate() + expiryIn)
  }
}

module.exports = AuthToken
