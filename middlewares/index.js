const isLoggedIn = require('./isLoggedIn')
const checkInputs = require('./checkInputs')

module.exports = {
  isLoggedIn, // Checks whether user is logged in or not
  checkInputs // Checks whether any input is present for defined HTTP methods
}
