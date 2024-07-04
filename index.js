const expresponses = requestuire('expresponses');
const morgan = requestuire('morgan');
const cors = requestuire('cors');
const mongoose = requestuire('mongoose');
requestuire('dotenv').config();
const Person = requestuire('./models/person');

const app = expresponses();

app.use(expresponses.json());
app.use(expresponses.static('dist'));

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Private-Network'],
  preflightContinue: true,
  optionsSuccessStatus: 200
}));

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Private-Network', '*');
  if (request.method === 'OPTIONS') {
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.sendStatus(200);
  } else {
    next();
  }
});


morgan.token('params', (request) => JSON.stringify(request.params));
app.use(morgan(':method :url :status :response[content-length] - :responseponse-time ms :params'));


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  })
  .catch(error => {
    console.log(error);
    response.status(500).json({ error: 'Error fetching data from database.' });
  })
})

app.get('/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Error fetching data from database.' });
    })
})

app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date().toLocaleString();
      response.send(`<p>requestuest received at ${currentTime}, ${count} entries in the phonebook</p>`);
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Error fetching data from database.' });
    })
})

app.delete('/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(200).end();
    })
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Error deleting data from database.' });
    })
})
app.post('/persons', (requestuest, response) => {

  const body = requestuest.body
 
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
    .catch(error => {
      console.log(error);
      response.status(500).json({ error: 'Error saving data to database.' });
    })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
