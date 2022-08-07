const express = require('express')
const app = express()
app.use(express.json())
const generateId = () => Math.floor(Math.random()*1000)

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
    res.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === +id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }    
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
    const foundPerson = persons.find( p => p.name === body.name) 
    if(foundPerson) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
    const newPerson = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
    response.json(newPerson)
  })  

  const PORT = 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

