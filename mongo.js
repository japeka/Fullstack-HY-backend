/* eslint-disable no-undef */
const mongoose = require('mongoose')

const getPerson = (password) => {
  const url = `mongodb+srv://fullstack:${password}@cluster0.2ux4a.mongodb.net/phoneBook?retryWrites=true&w=majority`
  mongoose.connect(url)
  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  return mongoose.model('Person', personSchema)
}

if (process.argv.length === 3) {
  const Person = getPerson(process.argv[2])
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const Person = getPerson(process.argv[2])
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('too few arguments (valid # of args: 3 or 5)')
  process.exit(1)
}
