const express = require("express");
const app = express();
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('person', function (req, res) { return JSON.stringify(req.body)})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "111111111",
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "22222222222",
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "33333333333",
      },
      {
        id: 4,
        name: "Mary Poppendick",
        number: "444444444444",
      }
]

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person 
    ? res.json(person) 
    : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'missing name and/or number'
    })
  } 

  const generateId = () => Math.floor(Math.random() * Math.floor(1000))
  const person = {
    id: generateId(),
    name: req.body.name,
    number: req.body.number
  }

  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  } else {
    persons = persons.concat(person)
    res.json(person)
  }
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})