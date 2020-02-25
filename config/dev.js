module.exports = {
  PORT: 3000,
  secret: '5n3GPA5WUHXgcm4N2FnP6f3UY5aQexLP',
  expiryTime: '10m', // In Minutes or Formatted string -- 1h, 15m
  tokenExpiryTime: 60, // In days [ Long lived tokens expiry time ]
  globalNamespace: 'reqGlobals',
  DB: {
    USERNAME: 'kgoel085',
    PASSWORD: '123456789',
    HOST: 'localhost',
    PORT: 27017,
    DATABASE: 'blogify'
  }
}
