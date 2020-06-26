require('dotenv').config()

const express = require('express')

const { connectToDb } = require('./db')
const { installHandler } = require('./api_handler')

const app = express()

installHandler(app)

const port = process.env.API_SERVER_POLL || 3000

;(async function start() {
  try {
    await connectToDb()
    app.listen(port, () => console.log(`API started on port ${port}`))
  } catch (err) {
    console.log('ERROR', err)
  }
})()
