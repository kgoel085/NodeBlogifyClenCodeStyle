const isLoggedIn = require('./isLoggedIn')
const checkInputs = require('./checkInputs')
const globalSetting = require('./globalSettings')

module.exports = {
  isLoggedIn, // Checks whether user is logged in or not
  checkInputs, // Checks whether any input is present for defined HTTP methods
  globalSetting // Set vars from req, res that needs globally
}
