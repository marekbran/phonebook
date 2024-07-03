const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
require('dotenv').config() 
const Person = require('./models/person')


app.use(express.json());
app.use(express.static('dist'));

app.use(cors({
  origin: '*', 
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Private-Network'],
  preflightContinue: true,
  optionsSuccessStatus: 200
}));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Private-Network', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
  } else {
    next();
  }
});


morgan.token('params', (req) => JSON.stringify(req.params));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :params'));
let persons = [];

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(response => {
    console.log(`connected successfully to MongoDB`)
  })
  .catch((error) => console.log(error.message + ' did not connect.'));

Person.find({}).then(persons => {
  persons = persons.map(person => person.toJSON())
})
  .catch(error => console.log(error));

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({error: 'Error fetching data from database.'})
  })
});

app.get('/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get('/info', (req, res) => {
  const x = persons.length;
  const currentTime = new Date().toLocaleString();
  res.send(`<p>Request received at ${currentTime}, ${x} entries in the phonebook</p>`);
});

app.delete('/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(200).end();
});

app.post('/persons/:name/:number', (req, res) => {
  const body = req.params;
  const id = Math.random(1000);

  if (!body.name) {
    return res.status(400).json({ error: 'name missing' });
  }

  if (!body.number) {
    return res.status(400).json({ error: 'number missing' });
  }

  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  if (persons.find(person => person.number === body.number)) {
    return res.status(400).json({ error: 'number must be unique' });
  }

  const person = {
    id,
    name: body.name,
    number: body.number
  };
  person.save().then(savedPerson => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
