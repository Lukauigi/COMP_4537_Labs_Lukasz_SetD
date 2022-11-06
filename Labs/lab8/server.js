const express = require('express')
const mongoose = require('mongoose')
const https = require('https')
const request = require('request')
const {
    PokemonBadRequest,
    PokemonBadRequestMissingID,
    PokemonDbError,
    PokemonNotFoundError,
    PokemonNoRouteError,
    PokemonDuplicateError,
    PokemonBadRequestBadParameters
} = require('./pokemonErrors.js')

const app = express()
const port = 5000
const { Schema } = mongoose;
const pokemonJsonUrl = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json"
const pokemonTypesJsonUrl = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json"
const pokemonImagesBaseUrl = "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/"

var pokemonTypes = [];

  // creates pokemon schema 
  const initiatizePokemonSchema = () => {
    var pokemonSchema = new Schema({
        "name": {
            "english": { type: String, required: true, maxlength: 20 },
            "japanese": String,
            "chinese": String,
            "french": String
        },
        "type": [{ 
            type: String, 
            enum: pokemonTypes,
    }],
        "base": {
            "HP": Number,
            "Attack": Number,
            "Defense": Number,
            "Speed": Number,
            "Special Attack": Number,
            "Special Defense": Number
        },
        "id": { 
            type: Number, 
            unique: [true, "Cannot have 2 pokemons with the same ID"]
        }
      })

      return pokemonSchema;
  }

const pokemonModel = mongoose.model('pokemon', initiatizePokemonSchema());

app.listen(process.env.PORT || port, async () => {
    try {
      // connect to database
      await mongoose.connect('mongodb+srv://luke:4QC9OhKvqVheWmTf@a1.wcgrq99.mongodb.net/?retryWrites=true&w=majority')
      await mongoose.connection.db.dropDatabase() //drop previous collection records

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
            console.log(pokemonTypes);
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

app.use(express.json())

// get all pokemons or within a range
app.get('/api/v1/pokemons', async (req, res) => {
    try {
        if (req.query.count === undefined || req.query.after === undefined) {
            const records = await pokemonModel.find({})
            if (records.length > 0) res.json(records)
            else throw new PokemonDbError('');
        } else if (Number.isInteger(+req.query.count) && Number.isInteger(+req.query.after)) {
            const after = +req.query.after; //extract number from string
            const count = +req.query.count; //extract number form string
            const selection = { //get pokemon between query params 
                id: {
                    $gt : after, 
                    $lte : (count+after)
                } 
            }

            const records = await pokemonModel.find(selection)
            if (records.length > 0) res.json(records)
            else throw new PokemonBadRequest('');
        } else {
            throw new PokemonBadRequestBadParameters('');
        }
    } catch (error) {
        res.json({ Error: error.name, ErrorMsg: error.message })
    }
})

// create a new pokemon
app.post('/api/v1/pokemon', async (req, res) => {
    try {
        if (!req.body.id) throw new PokemonBadRequestMissingID('');
    
        const selection = { id: req.body.id }
        const pokemon = await pokemonModel.find(selection)
        if (pokemon.length != 0) throw new PokemonDuplicateError('');
        
        const record = await pokemonModel.create(req.body)
        res.json({ msg: "Added Successfully", pokemon: record })
    } catch (error) {
        res.json({ Error: error.name, ErrorMsg: error.message })
    } 

    // console.log(`find me: ${Object.keys(req)}`);
    // pokemonModel.create({
    //     "name": req.body.name,
    //     "type": req.body.type,
    //     "base": {
    //         "HP": req.body.base['HP'],
    //         "Attack": req.body.base['Attack'],
    //         "Defense": req.body.base['Defense'],
    //         "Speed": req.body.base['Speed'],
    //         "Special Attack": req.body.base['Special Attack'],
    //         "Special Defense": req.body.base['Special Defense']
    //     },
    //     "id": req.body.id
    // }).then(
    //     res.json({ msg: "Added Successfully"})
    // ).catch( error => {
    //     console.log(error);
    // })
})

// get a pokemon
app.get('/api/v1/pokemon/:id', async (req, res) => {
    const pokemonQuery = { id: req.params.id }

    const record = await pokemonModel.findOne(pokemonQuery)

    if (record) {
        res.json(record)
    } else {
        //res.json({ errMsg: 'Cast Error: pass pokemon id between 1 and 811' })
        throw new PokemonNotFoundError('');
    }

    // pokemonModel.findOne({ id: req.params.id }).then(document => {
    //     if (document == null) res.json({errMsg: 'A pokemon with that id does not exist. Try an integer id between 1 and 809'})
    //     else res.json(document)
    // }).catch(error => {
    //     console.error(error)
    //     res.json({ errMsg: 'Cast Error: pass pokemon id between 1 and 811' })
    //     throw new PokemonNotFoundError('');
    // })
})

// get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', async (req, res) => {
    try {
        const selection = { id: req.params.id }

        record = await pokemonModel.findOne(selection)
        if (record) {
            const idNumber = record.id.toString();
            let imageFileName = '.png'
    
            // determines if and how much 0s need to be prepend to the image's filename
            switch (idNumber.length) {
                case 1:
                    imageFileName = '00' + idNumber + imageFileName
                    break;
                case 2:
                    imageFileName = '0' + idNumber + imageFileName
                    break;
                case 3:
                    imageFileName = idNumber + imageFileName
                    break;
            }
    
            console.log(pokemonImagesBaseUrl + imageFileName);
    
            // credit: https://stackoverflow.com/questions/60754335/how-do-i-send-image-data-from-a-url-using-express
            //      user: Fadil Natakusumah
            request({
                url: pokemonImagesBaseUrl + imageFileName,
                encoding: null
            },
            (error, response, buffer) => {
                if (!error && response.statusCode === 200) {
                    res.set('Content-Type', 'image/png')
                    res.send(response.body)
                }
            })
        } else {
            throw new PokemonBadRequestMissingID('');
        }
    } catch (error) {
        res.json({ Error: error.name, ErrorMsg: error.message })
    }



    // pokemonModel.findOne({ id: req.params.id }).then(document => {
    //     const idNumber = document.id.toString();
    //     const imageFileName = '.png'

    //     // determines if and how much 0s need to be prepend to the image's filename
    //     switch (idNumber.length) {
    //         case 1:
    //             imageFileName = '00' + idNumber + imageFileName
    //             break;
    //         case 2:
    //             imageFileName = '0' + idNumber + imageFileName
    //             break;
    //         case 3:
    //             imageFileName = idNumber + imageFileName
    //             break;

            
    //     }

    //     console.log(pokemonImagesBaseUrl + imageFileName);

    //     // credit: https://stackoverflow.com/questions/60754335/how-do-i-send-image-data-from-a-url-using-express
    //     //      user: Fadil Natakusumah
    //     request({
    //         url: pokemonImagesBaseUrl + imageFileName,
    //         encoding: null
    //     },
    //     (error, response, buffer) => {
    //         if (!error && response.statusCode === 200) {
    //             res.set('Content-Type', 'image/png')
    //             res.send(response.body)
    //         }
    //     })
    // }).catch(error => {
    //     console.error(error)
    //     res.json({ errMsg: 'Cast Error: pass pokemon id between 1 and 811' })
    // })
})

// upsert a whole pokemon document
app.put('/api/v1/pokemon/:id', async (req, res) => {
    try {
        const selection = { id: req.params.id }
        const updateInfo = req.body
        const options = {
            new: true,
            runValidators: true,
            overwrite: true
        }

        const record = await pokemonModel.findOneAndUpdate(selection, updateInfo, options)
        if (record) res.json({ msg: "Updated Successfully", pokeInfo: record })
        else throw new PokemonNotFoundError('');
    } catch (error) {
        res.json({ Error: error.name, ErrorMsg: error.message })
    }
    

    // const { ...rest } = req.body
    // pokemonModel.findOneAndUpdate({ id: req.params.id }, { 
    //     "name": req.body.name,
    //     "type": req.body.type,
    //     "base": {
    //         "HP": req.body.base['HP'],
    //         "Attack": req.body.base['Attack'],
    //         "Defense": req.body.base['Defense'],
    //         "Speed": req.body.base['Speed'],
    //         "Special Attack": req.body.base['Special Attack'],
    //         "Special Defense": req.body.base['Special Defense']
    //     },
    //     "id": req.body.id
    //  }, { upsert: true, returnOriginal: false, $set: {...rest}, runValidators: true }).then(document => {
    //     if (document == null) res.json({ errMsg: 'A pokemon with that id does not exist. Try an integer id between 1 and 809' })
    //     res.json({ msg: "Updated Successfully", pokeInfo: document })
    // }).catch(error => {
    //     console.error(error)
    //     res.json({ msg: 'Not found'})
    // })
})

// patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', async (req, res) => {
    try {
        const selection = { id: req.params.id }
        const updateInfo = req.body
        const options = {
            new: true,
            runValidators: true
        }

        const record = await pokemonModel.findOneAndUpdate(selection, updateInfo, options)
        if (record) res.json({ msg: "Updated Successfully", pokeInfo: record })
        else throw new PokemonNotFoundError('');
    } catch (error) {
        res.json({ Error: error.name, ErrorMsg: error.message })
    }
    

    // pokemonModel.findOneAndUpdate({ id: req.params.id }, { 
    //     "base" : {
    //         "HP": req.body.base['HP'],
    //         "Attack": req.body.base['Attack'],
    //         "Defense": req.body.base['Defense'],
    //         "Speed": req.body.base['Speed'],
    //         "Special Attack": req.body.base['Special Attack'],
    //         "Special Defense": req.body.base['Special Defense']
    //     }
    //  }, { returnOriginal: false } ).then(document => {
    //     if (document == null) res.json({ errMsg: 'A pokemon with that id does not exist. Try an integer id between 1 and 809' })
    //     res.json({ msg: "Updated Successfully", pokeInfo: document })
    // }).catch(error => {
    //     console.error(error)
    //     res.json()
    // })
})

// delete a pokemon
app.delete('/api/v1/pokemon/:id', async (req, res) => {
    try {
        const selection = { id: req.params.id }
        const record = await pokemonModel.findOneAndDelete(selection)

        console.log(record);

        if (record) res.json({ msg: "Deleted Successfully", pokeInfo: record })
        else throw new PokemonNotFoundError('');
    } catch (error) {
        res.json({ Error: error.name, ErrorMsg: error.message })
    }
    

    // try {
    //     pokemonModel.findOneAndDelete({ id: req.params.id }).then(document => {
    //         if (document == null) res.json({ errMsg: 'A pokemon with that id does not exist. Try an integer id between 1 and 809' })
    //         res.json({ msg: "Deleted Successfully", pokeInfo: document })
    //     }).catch(error => {
    //         console.error(error)
    //         res.json({ errMsg: 'Cast Error: pass pokemon id between 1 and 811'})
    //     })
    // } catch (err) {
    //     console.log(err);
    // }
    
})

// app.get('api/doc')
app.get('/api/doc', (req, res) => {
    res.send('here is the documenation')
})

// handle import route
app.get('*', (req, res) => {
    try {
        throw new PokemonNoRouteError('');
    } catch (PokemonNoRouteError) {
        res.json({ msg: 'Improper route. Check API docs plz.' })
    }
    
})
