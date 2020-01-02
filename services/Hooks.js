const { hasOwnProperty } = require('./../helpers')

class Hooks {
  constructor () {
    this.queue = {}
  }

  // Add functions to hooks queue
  addHook (method, cb) {
    // If method is not present in the queue, add it
    if (!hasOwnProperty(this.queue, method)) this.queue[method] = []
    // Only add functions
    if (cb && typeof cb === 'function') this.queue[method].push(cb)
  }

  callHook (method, ...params) {
    if (hasOwnProperty(this.queue, method)) {
      // Execute all the cb under the required hook
      this.queue[method].forEach(fn => fn(...params))
      delete this.queue[method]
    }
  }
}

module.exports = Hooks
