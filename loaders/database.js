const mongodb = require('mongodb')
const { DB } = require('./../config')

const makeIdFromString = (id = false) => {
  if (id) return new mongodb.ObjectID(id.toString())
}

const connectDb = async () => {
  try {
    const MongoClient = mongodb.MongoClient
    const url = `mongodb://${DB.USERNAME}:${DB.PASSWORD}@${DB.HOST}:${DB.PORT || 27017}/${DB.DATABASE}?authSource=${DB.AUTH_SOURCE || 'admin'}`

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true })
    await client.connect()

    const db = await client.db(DB.DATABASE)
    db.makeId = (id) => makeIdFromString(id)

    return db
  } catch (err) {
    console.log(err)
    // assert.strictEqual(null, err)
  }
}

module.exports = connectDb
