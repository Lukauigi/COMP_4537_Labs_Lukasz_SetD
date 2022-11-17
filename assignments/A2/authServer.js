const mongoose = require('mongoose')
const express = require('express')
const {
    PokemonBadRequest,
    PokemonBadRequestMissingID,
    PokemonDbError,
    PokemonNotFoundError,
    PokemonNoRouteError,
    PokemonDuplicateError,
    PokemonBadRequestBadParameters
} = require('./pokemonErrors.js')
const pokeUserModel = require('./pokeUserModel')
const { handleError } = require('./errorHandler')

const { asyncWrapper } = require('./asyncWrapper.js')

const dotenv = require("dotenv")
dotenv.config();

const app = express()

app.listen(process.env.AUTH_PORT, async (error) => {
    if (error) throw new PokemonDbError('');
    else {
        await mongoose.connect(process.env.Mongo_Atlas_DB_String)
        console.log(`Auth server is running on port: ${process.env.AUTH_PORT}`);
    }    
})

app.use(express.json())

/* ------------------------------------------ */
/* ////// CRUD Operations of User Data \\\\\\ */
/* ------------------------------------------ */

const bcrypt = require('bcrypt')

app.post('/register', asyncWrapper(async (req, res) => {
    const { username, password, email } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    

    // Create and assign a token
    const token = jwt.sign({ _id: username }, `${process.env.TOKEN_SECRET}`)
    console.log(token);
  
    res.header('auth-token', token)

    const pokeUser = { ...req.body, password: hashedPassword, token: token }

    const user = await pokeUserModel.create(pokeUser)
    res.send(pokeUser)
}))

const jwt = require("jsonwebtoken")

app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const user = await pokeUserModel.findOne({ username })
  if (!user) {
    throw new PokemonBadRequest("User not found")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonBadRequest("Password is incorrect")
  }

  //update user with token
  const selection = { username: user.username }
  const updateInfo = { $set: { isLoggedIn: true } }
  const options = {
      new: true,
      runValidators: true,
      overwrite: true,
  }
  const updatedUser = await pokeUserModel.findOneAndUpdate(selection, updateInfo, options)

  res.send(updatedUser)
}))

app.post('/logout', asyncWrapper(async (req, res) => {
    const { username, password } = req.body
    const user = await pokeUserModel.findOne({ username })
    if (!user) {
        throw new PokemonBadRequest("User not found")
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        throw new PokemonBadRequest("Password is incorrect")
    }

    //update user logged in status
    const selection = { username: user.username }
    const updateInfo = { $set: { isLoggedIn: false } }
    const options = {
        new: true,
        runValidators: true,
        overwrite: true,
    }
    const updatedUser = await pokeUserModel.findOneAndUpdate(selection, updateInfo, options)

    res.send(updatedUser)
}))

app.use(handleError)