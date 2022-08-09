require('dotenv').config()

const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

mongoose.connect(process.env.MONGODB_URI)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  })
)

let persons = 
[
    {
      name: "Arto Hellas",
      number: "123-123",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]
  
  app.get('/info', (req, res) => {
    res.send(`
        <h3>Phonebook has info for ${persons.length} people</h3>
        <p>${new Date().toString()}</p>
        `)
  })
  
  app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })    
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => {
      response.json(person)
    })
  })  

  app.delete('/api/persons/:id', (request, response) => {
    const id = +request.params.id
    const person = persons.find(p => p.id === +id)
    if(person) {
        persons = persons.filter(p => p.id !== id)
        response.status(204).end()
    } else {
        response.status(404).end()
    }
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number is missing' 
      })
    }
    const person = new Person({
      name: body.name,
      number: body.number,
    })
    person.save().then(savedPerson => { 
      response.json(savedPerson)
    })
  })  

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


