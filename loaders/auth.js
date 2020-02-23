const passport = require('passport')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')
const { secret } = require('./../config')
const { setNameSpaceItem } = require('./../helpers')
const UserModel = require('./../modules/User')

module.exports = async app => {
  // JWT Passport Strategy
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
  }, async (payload, done) => {
    try {
      const { data: user } = await UserModel.findById(payload.sub)
      if (!user) done(null, false)

      setNameSpaceItem('user', user) // Set user to be available everywhere
      done(null, user)
    } catch (err) {
      done(err, false)
    }
  }))

  return app
}
