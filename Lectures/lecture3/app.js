const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 5000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use(express.static('public')); // quick access to static files in public folder
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params.id
  res.send(id)
})

app.post('/profile/:id', (req, res) => {
  req.body.userID;
  res.json(req.body.userID);
})

app.post('/', (req, res) => {
  res.send('Got a POST from default route.')
})

app.put('/user', (req, res) => {
  res.send('Got a put request from user param')
})

// app.delete('/user', (req, res) => 
//   console.log('received a delete request from user param')
// })

