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


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/persons', (req, res) => {
  console.log("kurwaaaaaaaaa");
  Person.find({}).then(persons => {
    res.json(persons);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ error: 'Error fetching data from database.' });
  })
})

app.get('/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error fetching data from database.' });
    })
})

app.get('/info', (req, res) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date().toLocaleString();
      res.send(`<p>Request received at ${currentTime}, ${count} entries in the phonebook</p>`);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error fetching data from database.' });
    })
})

app.delete('/persons/:id', (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(200).end();
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error deleting data from database.' });
    })
})

app.post('/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error saving data to database.' });
    })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
