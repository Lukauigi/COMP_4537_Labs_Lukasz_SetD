const express = require('express')
const mongoose = require('mongoose')
const https = require('https')

const app = express()
const port = 5000
const { Schema } = mongoose;
const pokemonJsonUrl = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
const pokemonTypesJsonUrl = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json"

var pokemonTypes = [];

app.listen(process.env.PORT || port, async () => {
    try {
      // connect to database
      await mongoose.connect('mongodb+srv://luke:4QC9OhKvqVheWmTf@a1.wcgrq99.mongodb.net/?retryWrites=true&w=majority')
      mongoose.connection.db.dropCollection('pokemons') //drop previous collection records

      // initialize pokemon schema & model
      await initiatizePokemonSchema()
      const pokemonModel = mongoose.model('pokemon', pokemonSchema);

      // populate the database with pokemon
      https.get(pokemonJsonUrl, async (res) => {
        try {
            var chunks = ""; // all chunks of pokemon data, init to empty
            res.on("data", function (chunk) {
                chunks += chunk; // append each data chunk to chunks container
            })
            res.on("end", async function (data) {
                const response = JSON.parse(chunks)
                console.log('got pokemon data');
                console.log(response[2]);

                // create a document in db for every pokemon in json
                response.map(element => { 
                    pokemonModel.create(element, function (error) {
                        if (error) console.log(`could not create this pokemon in db: ${element}`);
                    })
                })
            })
        } catch (error) {
            console.log('could not get pokemon type data');
        }
      })

    } catch (error) {
      console.log('db error');
    }
    
  })

  // Get all pokemon types and insert them into an enum
  https.get(pokemonTypesJsonUrl, async (res) => {
    try {
        var chunks = ""; // all chunks of pokemon data, init to empty
        res.on("data", function (chunk) {
            chunks += chunk; // append each data chunk to chunks container
        })
        res.on("end", function (data) {
            const response = JSON.parse(chunks)
            response.map(element => { pokemonTypes.push(element['english']) }) // get all english types names as enums
            console.log('mapped data')
            Object.freeze(pokemonTypes) //does not allow for changes to object
        })
    } catch (error) {
        console.log('could not get pokemon type data');
    }
  })

  // creates pokemon schema 
  const initiatizePokemonSchema = async () => {
    pokemonSchema = new Schema({
        "name": {
            "english": String,
            "japanese": String,
            "chinese": String,
            "french": String
        },
        "type": [{ type: String, enum: pokemonTypes, validate: [pokemonTypeLimit, 'Pokemon type must be 1 or 2 types only']}],
        "base": {
            "HP": Number,
            "Attack": Number,
            "Defense": Number,
            "Speed": Number,
            "Sp. Attack": Number,
            "Sp. Defense": Number
        },
        "id": { type: Number, unique: true }
      })
  }

// Validates if the type limit is 1 or 2 types in type array
function pokemonTypeLimit(value) {
    return 1 <= value.length <= 2;
}


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
