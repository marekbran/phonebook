const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  });

  const personSchema = new mongoose.Schema({
    name: { type: String,
    minLength: 3,
    required: true,
    },
    number: {
      type: String,
      validate: {
        validator: function(value) {
          const parts = value.split('-');
          if (parts.length !== 2) {
            return false;
          }
          const [firstPart, secondPart] = parts;
          if (firstPart.length < 2 || firstPart.length > 4) {
            return false;
          }
          if (secondPart.length < 6) {
            return false;
          }
          return /^[0-9]+$/.test(firstPart) && /^[0-9]+$/.test(secondPart)
        },
        message: 'Invalid phone number format',
      },
    },
  })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Person', personSchema)
