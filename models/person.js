const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'must be at least 3 characters long'],
    required: [true, 'is required']
  },
  number: {
    type: String,
    minLength: [8, 'must be at least 8 characters long'],
    required: [true, 'is required'],
    validate: function(v) {
      return /\d{2,3}-\d+/.test(v)
    },
    message: props => `${props.value} is not a valid phone number! Format should be XX-XXXXXX.`
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

