const mongoose = require('mongoose');


const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];


const url = `mongodb+srv://MarekBran:${password}@tomaszabazadanych.qosjlni.mongodb.net/?appName=TomaszaBazaDanych`;


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);


if (name && number) {
  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {

  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}
