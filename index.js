require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require('morgan')
const Listing = require('./models/listing')
const cors = require('cors');
const { response } = require('express');
const e = require('express');
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
morgan.token('person', function (req, res) { return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))

app.get('/info', (req, res) => {
  Listing.find({}).then(listings => {
    res.send(`<p>Phonebook has info for ${listings.length} people</p><p>${Date()}</p>`)
  })
  //res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
  Listing.find({}).then(listings => {
    res.json(listings)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Listing.findById(req.params.id)
    .then(listing => {
      if (listing) {
        res.json(listing)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Listing.findByIdAndRemove(req.params.id)
    .then(listing => {
      if (listing) {
        res.json(listing)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: 'missing name and/or number'
    })
  } 

  // const generateId = () => Math.floor(Math.random() * Math.floor(1000))
  const listing = new Listing({
    name: req.body.name,
    number: req.body.number
  })

  // if (persons.find(p => p.name === person.name)) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   })
  // } else {
  //   persons = persons.concat(person)
  //   res.json(person)
  // }
  listing.save().then(savedListing =>{
    res.json(savedListing)
  })
})

app.put('/api/persons/:id', (req, res, next)=> {
  const listing = new Listing({
    number: req.body.number
  })
  Listing.findByIdAndUpdate(req.params.id, listing, { new: true })
    .then(updatedListing => {
      res.json(updatedListing)
    })
    .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.message ==='CastError') {
    return res.status(400).send({error: 'malformatted id'})
  } 
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})