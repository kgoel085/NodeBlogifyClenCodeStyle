const User = require('../modules/User')

module.exports = {
  // signup user to the system
  signup: (req, res, nxt) => {
    const userData = req.body

    User.signup(userData)
      .then(result => res.status(result.statusCode).json(result))
      .catch(err => nxt(err))
  },

  // Log user in
  login: async (req, res, nxt) => {
    const userData = req.body

    try {
      // Check for user & generate token
      const { token, statusCode, success, ...data } = await User.login(userData)
      if (!success || !token) throw new Error('Error logging in !')
      return res.status(statusCode).json({ ...data, token, success })
    } catch (err) {
      nxt(err)
    }
  }
}
