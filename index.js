const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()

const path = require('path')
app.use(express.static('dist'))

app.use(express.json())

morgan.token('postData', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return '-'
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
app.use(cors())

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 1000000).toString()
}

app.post('/api/persons', (request,response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    console.log(`Recieved DELETE request`)
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    console.log('Updated persons array');
    

    response.status(204).end()
  })

  app.get('/api/persons/:id',(request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

app.get('/info',(request, response) => {
    const date = new Date()
    const personCount = persons.length

    const text = `
    <p>Phonebook has info for ${personCount} people</p>
    <p>${date}</p>
    `

    response.send(text)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})