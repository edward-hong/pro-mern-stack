const express = require('express')

const app = express()

app.use(express.static('public'))

const PORT = process.env.PORT || 8000

app.listen(PORT, function () {
  console.log(`UI started on port ${PORT}`)
})
