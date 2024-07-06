const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Person = require('./models/person');

const app = express();

app.use(express.json());
app.use(express.static('dist'));

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Private-Network'],
  preflightContinue: true,
  optionsSuccessStatus: 200
}))

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
  } else {
    next();
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


morgan.token('params', (req) => JSON.stringify(req.params));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :params'));


app.get('/', (req, res, next) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons);
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date().toLocaleString();
      res.send(`<p>Request received at ${currentTime}, ${count} entries in the phonebook</p>`);
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findOneAndDelete({ _id: req.params.id })
    .then(() => {
      res.status(200).end();
    })
    .catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
  console.log("r", request.body)
  const body = request.body
 
  if (!body.name || !body.number) {
    console.log('Missing name or number');
    return response.status(400).json({ error: 'name or number missing' });
  }


  const person = new Person({
    name: body.name,
    number: body.number,
  })


  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedperson => {
      response.json(updatedperson)
    })
    .catch(error => next(error))
})


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
