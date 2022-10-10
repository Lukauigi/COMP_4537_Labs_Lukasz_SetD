const express = require('express')
const mongoose = require('mongoose')
const https = require('https')

const app = express()
const port = 5000
const { Schema } = mongoose;
const pokemonJsonUrl = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
const pokemonTypesJsonUrl = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json"

var pokemonTypes = [];

  // creates pokemon schema 
  const initiatizePokemonSchema = () => {
    var pokemonSchema = new Schema({
        "name": {
            "english": { type: String, max: 20 },
            "japanese": String,
            "chinese": String,
            "french": String
        },
        "type": [{ 
            type: String, 
            enum: pokemonTypes, 
            validate: {
                validator: function() {
                    return 1 >= this.type.length <= 2;
                },
                message: 'pokemon type must be 1 or 2 type(s)'
        }}],
        "base": {
            "HP": Number,
            "Attack": Number,
            "Defense": Number,
            "Speed": Number,
            "Special Attack": Number,
            "Special Defense": Number
        },
        "id": { type: Number, unique: true }
      })

      return pokemonSchema;
  }

const pokemonModel = mongoose.model('pokemon', initiatizePokemonSchema());

app.listen(process.env.PORT || port, async () => {
    try {
      // connect to database
      await mongoose.connect('mongodb+srv://luke:4QC9OhKvqVheWmTf@a1.wcgrq99.mongodb.net/?retryWrites=true&w=majority')
      //await mongoose.connection.db.dropDatabase() //drop previous collection records

      // populate the database with pokemon
      await populateDatabase();

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

  const populateDatabase = async () => {
    https.get(pokemonJsonUrl, (res) => {
        try {
            var chunks = ""; // all chunks of pokemon data, init to empty
            res.on("data", async function (chunk) {
                chunks += chunk; // append each data chunk to chunks container
            })
            res.on("end", async function (data) {
                const response = await JSON.parse(chunks)
                console.log(Object.keys(response).length);
                console.log('got pokemon data');
                console.log(response[2].base['Sp. Attack']);

                // create a document in db for every pokemon in json
                response.map(element => {
                    // https://stackoverflow.com/questions/10333540/mongo-dot-notation-ambiguity
                    // I have to manually fill fields or Sp. Attack & Sp. Defense will be a object called Sp with attack & defense fields, which is not the intended design of the model.
                    pokemonModel.create({
                        "name": element.name,
                        "type": element.type,
                        "base": {
                            "HP": element.base['HP'],
                            "Attack": element.base['Attack'],
                            "Defense": element.base['Defense'],
                            "Speed": element.base['Speed'],
                            "Special Attack": element.base['Sp. Attack'],
                            "Special Defense": element.base['Sp. Defense']
                        },
                        "id": element.id
                    }, function (error) {
                        if (error) {
                            //console.log(`could not create pokemon with id: ${element.id} in db`);
                            //console.log(error);
                            return ;
                        }
                    })
                })
            })
        } catch (error) {
            console.log('could not get pokemon type data');
        }
      })
  }

// get all pokemons with query params: count & after
app.get('/api/v1/pokemons', (req, res) => {
    if (+req.query.count && +req.query.after) {
        try {
            var after = +req.query.after; //extract number from string
            var count = +req.query.count; //extract number form string

            pokemonModel.find({ 
                id: {$gt : after, $lte : (count+after)} //get pokemon between query params 
            }).then(records => {
                console.log("records length: " + records.length);
                records.forEach(index => console.log(index.id));
                res.send(JSON.stringify(records, null, '\t'))
            }).catch(err => {
                console.log(err);
            })
        } catch (error) {
            res.send('count & after must be numbers')
        }    
    } else {
        res.send('enter query params for count & after as numbers');
    }
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
