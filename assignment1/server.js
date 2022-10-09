const express = require('express')
const mongoose = require('mongoose')
const https = require('https')

const app = express()
const port = 5000

app.listen(process.env.PORT || port, async () => {
    try {
      await mongoose.connect('mongodb+srv://luke:4QC9OhKvqVheWmTf@a1.wcgrq99.mongodb.net/?retryWrites=true&w=majority')
    } catch (error) {
      console.log('db error');
    }
  })
  
  
const { Schema } = mongoose;


// get all pokemons
app.get('/api/v1/pokemons', (req, res) => {
    res.send('here are pokemons')
})
// get all the pokemons after the 10th. List only Two.
app.get('/api/v1/pokemons?count=2&after=10', (req, res) => {
    res.send('here are pokemons')
})
// create a new pokemon
app.post('/api/v1/pokemon', (req, res) => {
    res.send('here are pokemons')
})
// get a pokemon
app.get('/api/v1/pokemon/:id', (req, res) => {
    res.send('here are pokemons')
})
// get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', (req, res) => {
    res.send('here are pokemons')
})
// upsert a whole pokemon document
app.put('/api/v1/pokemon/:id', (req, res) => {
    res.send('here are pokemons')
})
// patch a pokemon document or a
app.patch('/api/v1/pokemon/:id', (req, res) => {
    res.send('here are pokemons')
})
                                                    //   portion of the pokemon document
// delete a  pokemon
app.delete('/api/v1/pokemon/:id', (req, res) => {
    res.send('here are pokemons')
})

// app.get('api/doc')
app.get('/api/doc', (req, res) => {
    res.send('here is the documenation')
})
