import { useState, useEffect } from 'react'
import phonebookServices from '../services/phonebookServices'


const Numbers = ({ persons, setPersons, setNewError, setNewMessage }) => {
  const delet = (event, personId) => {
    event.preventDefault()
    if (window.confirm(`Delete ${persons.find(p => p.id === personId).name}?`)) {
      phonebookServices.del(personId).then(() => {
        setPersons(persons.filter(p => p.id !== personId))
      }).catch(error => {
        console.log(error.response.data)
        setNewError(
          `${persons.find(p => p.id === personId).name} has already been deleted`
        )
        setTimeout(() => {
          setNewMessage(null)
        }, 5000)
      })
      setNewMessage(
        `${persons.find(p => p.id === personId).name} has been deleted`
      )
      setTimeout(() => {
        setNewMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      {Array.isArray(persons) && persons.map(person => (
        <form key={person.id} onSubmit={(event) => delet(event, person.id)}>
          <div>
            <li>{person.name} {person.number} <button type="submit">delete</button></li>
          </div>
        </form>
      ))}
    </div>
  )
}

const PersonForm = ({ addPerson, newName, setNewName, newNumber, setNewNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        number: <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Filter = ({ nameFilter, filterPeople, filteredPersons }) => {
  return (
    <form>
      <div>
        filter shown with <input
          value={nameFilter}
          onChange={(event) => filterPeople(event)}
        />
      </div>
      {filteredPersons.map(person => (
        <div key={person.id}> {person.name} {person.number}</div>
      ))}
    </form>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [newMessage, setNewMessage] = useState(null)
  const [newError, setNewError] = useState(null)

  useEffect(() => {
    phonebookServices.getAll()
      .then(initialPeople => setPersons(initialPeople))
      .catch(error => console.log(error));
  }, []);

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }

    if (Array.isArray(persons) && persons.some((person) => person.name === newName && person.number === newNumber)) {
      alert(`${newName} is already added to phonebook`)
      return
    } else if (persons.some((person) => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        phonebookServices.update(persons.find(person => person.name === newName).id, personObject).then(returnedPerson => {
          setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
        }).catch(error => {
          console.log(error.response.data)
          setNewError(error.response.data.error)
        })
        setNewMessage(
          `${newName} has been updated`
        )
        setTimeout(() => {
          setNewMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
      }
    } else {
      phonebookServices.create(personObject).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      }).catch(error => {
        console.log(error.response.data)
        setNewError(error.response.data.error)
      })
      setNewMessage(
        `${newName} has been added to phonebook`
      )
      setTimeout(() => {
        setNewMessage(null)
      }, 5000)
      setNewName('')
      setNewNumber('')
    }
  }

  const filterPeople = (event) => {
    const value = event.target.value;
    setNameFilter(value);
    setFilteredPersons(persons.filter(person => person.name.includes(value)))
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={newMessage} />
      <Error message={newError} />

      <h3>Filter</h3>
      <Filter nameFilter={nameFilter} filterPeople={filterPeople} filteredPersons={filteredPersons} />

      <h3>Add new entry</h3>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />

      <h2>Numbers</h2>
      <Numbers persons={persons} setPersons={setPersons} setNewError={setNewError} setNewMessage={setNewMessage} />
    </div>
  )
}

export default App
