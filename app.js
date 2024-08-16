const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/persons')

const app = express()


// Middleware
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

morgan.token('postData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return '-'
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

// MongoDB connection
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })

  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
    process.exit(1)
  })

app.use('/api/persons', personsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app