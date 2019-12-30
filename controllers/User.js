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
      const { success, data } = await User.login(userData)
      console.log(data, success)
    } catch (err) {
      console.log(err)
      nxt(err)
    }
  }
}
