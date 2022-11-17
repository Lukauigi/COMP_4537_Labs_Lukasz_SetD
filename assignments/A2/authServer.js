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
    const userWithHashedPassword = { ...req.body, password: hashedPassword }

    const user = await pokeUserModel.create(userWithHashedPassword)
    res.send(user)
}))

const jwt = require("jsonwebtoken")
const { update } = require('./pokeUserModel')

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

  // Create and assign a token
  const token = jwt.sign({ _id: user._id }, `${process.env.TOKEN_SECRET}`)
  console.log(token);
  
  res.header('auth-token', token)

  //update user with token
  const selection = { id: user.id }
  const updateInfo = { $set: { token: token, isLoggedIn: true } }
  const options = {
      new: true,
      runValidators: true,
      overwrite: true,
  }
  const updatedUser = await pokeUserModel.findOneAndUpdate(selection, updateInfo, options)

  res.send(updatedUser)
}))

app.use(handleError)