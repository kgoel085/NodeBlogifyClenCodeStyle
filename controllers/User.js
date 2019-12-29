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

    User.login(userData)
      .then(result => res.status(result.statusCode).json(result))
      .catch(err => nxt(err))
  }
}
