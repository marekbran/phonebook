const http = require('http');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const uri = "mongodb+srv://MarekBran:VJl3EwHEu6HcwgvE@tomaszabazadanych.qosjlni.mongodb.net/?appName=TomaszaBazaDanych";

app.use(express.json());
app.use(express.static('dist'));

app.use(cors({
  origin: '*', // Adjust to your specific needs, specify allowed origins
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Private-Network'],
  preflightContinue: true,
  optionsSuccessStatus: 200
}));

// Middleware to handle preflight requests and set necessary headers
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

// Morgan logging setup
morgan.token('params', (req) => JSON.stringify(req.params));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :params'));

let persons = [
  { "id": 1, "name": "Arto Hellas", "number": "040-123456" },
  { "id": 2, "name": "Ada Lovelace", "number": "39-44-5323523" },
  { "id": 3, "name": "Dan Abramov", "number": "12-43-234345" },
  { "id": 4, "name": "Mary Poppendieck", "number": "39-23-6423122" }
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/persons', (req, res) => {
  res.json(persons);
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
  persons = persons.concat(person);
  res.json(person);
});

const PORT = 5317;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
