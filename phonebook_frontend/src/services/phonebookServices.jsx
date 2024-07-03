import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'
const Person = require('./models/person')

const getAll = () => {
  return Person.find({}).then(persons => {
    return persons.map(person => person.toJSON())
  }).catch(error => {
    console.log(error.message + ' did not connect.')
  })
}

const create = newObject=> {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data).catch(error => console.log(error))
}

const del = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then(response => response.data).catch(error => console.log(error))
}
 
const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data).catch(error => console.log(error))
}



export default { getAll, create, del, update}