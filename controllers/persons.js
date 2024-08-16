const personsRouter = require('express').Router
const Person = require('../models/person')

app.get('/api/persons',(request, response) => {
    Person.find({})
      .then(persons => response.json(persons))
  })
  
  app.get('/api/persons/:id',(request, response, next) => {
    Person.findById(request.params.id)
      .then(person => {
        if (person) response.json(person)
        else response.status(404).end()
      })
      .catch(error => next(error))
  })
  
  app.post('/api/persons', (request,response, next) => {
    const { name, number } = request.body
  
    if (!name || !number) {
      return response.status(400).json({
        error: 'name or number missing'
      })
    }
  
    Person.findOne({ name: name })
      .then(existingPerson => {
        if (existingPerson) {
          existingPerson.number = number
          return existingPerson.save()
        } else {
          const person = new Person({ name, number })
          return person.save()
        }
      })
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error))
  })
  
  app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
  
    Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators:true, upsert: true }
    )
  
      .then(updatedPerson => {
        if (updatedPerson) {
          response.json(updatedPerson)
        }
      })
      .catch(error => next(error))
  })
  
  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(() => response.status(204).end())
      .catch(error => next(error))
  })
  
  app.get('/info',(request, response, next) => {
    const date = new Date()
    Person.countDocuments({})
      .then(count => {
        const text =`<p>Phonebook has info for ${count} people</p>
              <p>${date}</p>
              `
        response.send(text)
      })
      .catch(error => next(error))
  })

  module.exports = personsRouter