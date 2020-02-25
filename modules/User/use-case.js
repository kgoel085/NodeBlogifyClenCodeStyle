const CRUD = require('../../services/CRUD')
const { RequiredParam, InvalidParam, UniqueConstraint } = require('./../../helpers/error')
const { setNameSpaceItem, decryptData } = require('./../../helpers')

class User extends CRUD {
  constructor (db, schema, encrypt = null, jwt = null) {
    // Set all the DB & Schema interface
    super(db, 'users', schema)
    // this.schema = schema
    this.encrypt = encrypt
    this.token = jwt
  }

  // Register / Signup user to the system
  async signup (obj) {
    // Perform validations

    // Check for required username / email
    const { username, email } = obj
    if (!username) throw new RequiredParam('Username')
    if (!email) throw new RequiredParam('Email')

    const userObj = await this.validateObj('signup', obj)

    // Encrypt password
    userObj.password = this.encrypt.makeHash(userObj.password)

    // Register user with the system
    const { success, statusCode, data } = await this.insert(userObj)
    const returnData = { success, statusCode, data: null, message: 'Error Occurred' }

    // If operation was success
    if (success && data.length === 1) {
      returnData.data = data[0]
      returnData.message = 'Signup was successful'

      return returnData
    }

    throw new Error({ ...returnData })
  }

  // Find user by it's credentials
  async findByCredentials (username, password) {
    // Check for username
    const { statusCode, success, data } = await this.findOne({ username, isActive: true })
    if (!success || statusCode !== 200 || !data) throw new Error('User not found !')

    // Check for password
    const { password: usrPassword } = data
    if (!this.encrypt.compareString(password, usrPassword)) throw new Error('Password is invalid !')

    return { success, statusCode, data, message: 'User is valid' }
  }

  // Log user in
  async login (obj) {
    const { username, password } = obj
    if (!username) throw new RequiredParam('Username')
    if (!password) throw new RequiredParam('Password')

    const { success, statusCode, data } = await this.findByCredentials(username, password)
    if (!data || !success || statusCode !== 200) throw new Error('Invalid credentials provided !')

    // Set user under global namespace
    setNameSpaceItem('user', data)

    // Generate token
    const token = await this.generateToken({ _id: data._id }, true)
    // await this.updateOne({ _id: data._id }, { $set: { ...data } })

    return { success, statusCode, token, msg: 'User verified' }
  }

  // Refresh token
  async refreshToken (refreshToken = null) {
    if (!refreshToken) throw new InvalidParam('Refresh token is invalid !')

    // Decrypted data from token
    const decryptedData = decryptData(refreshToken)
    if (!decryptedData) throw new InvalidParam('Invalid refresh token provided !')

    // Converted data from decrypted data
    const dataArr = JSON.parse(decryptedData)

    // Check whether identifier is valid or not
    const tokenUser = await this.token.checkRefreshToken(dataArr)
    const { data: UserData } = await this.findById(tokenUser)

    if (!tokenUser || !UserData) throw new InvalidParam('Invalid refresh token !')

    // Generate token
    const token = await this.generateToken({ _id: UserData._id })
    return { success: true, statusCode: 200, token, msg: 'Token refreshed' }
  }

  // --------------------------------------------------------- //
  // Validate whole object for user related process
  async validateObj (callFrom, userObj) {
    switch (callFrom) {
      case 'signup':
        // Check for required password vars
        this.validatePassword(userObj, true)

        // Check for unique entry
        await this.checkUniqueEntry(userObj)
        break
    }
    return this.mapSchema(userObj)
  }

  // Check for password
  validatePassword (obj, signUp = false) {
    const { password, confirmPassword } = obj
    if (!password) throw new RequiredParam('password')

    // if request is from signup
    if (signUp) {
      // Check for confirm password
      if (!confirmPassword) throw new RequiredParam('Confirm password')

      // Check whether password matched
      if (password.toString() !== confirmPassword.toString()) throw new InvalidParam('Password doesn\'t match')
    }
  }

  // Check whether the entry is unique or not
  async checkUniqueEntry (obj) {
    const { username, email } = obj

    // Check records
    const { success: USuccess, data: UData } = await this.findOne({ username })
    if (USuccess && UData) throw new UniqueConstraint('Username already exists')

    const { success: ESuccess, data: EData } = await this.findOne({ email })
    if (ESuccess && EData) throw new UniqueConstraint('Email already exists')

    return true
  }

  // Generate auth token for current user
  async generateToken (data = false, getRefreshCode = false) {
    if (!data) return false
    const token = await this.token.generate({}, { subject: data._id.toString() }, getRefreshCode) // Generate JWT
    return token
  }
}

module.exports = User
