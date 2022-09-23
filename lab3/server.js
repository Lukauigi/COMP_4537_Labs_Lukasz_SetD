const express = require('express')

const app = express()
const port = 5000

var { unicornsJSON } = require('./data.js')
//var unicornsJSON = []

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  }
)

app.get('/api/v1/unicorns', (req, res) => {
    res.json(unicornsJSON)
})

app.use(express.json())
  
app.post('/api/v1/unicorn', (req, res) => {
    unicornsJSON.push(req.body)
    console.log(unicornsJSON)
    res.send('Create a new unicorn')
})

app.get('/api/v1/unicorn/:id', (req, res) => {
    console.log('find a unicorn')
    var foundUnicorn = false
    for (i = 0; i < unicornsJSON.length; i++) {
        if (unicornsJSON[i]._id == req.params.id) {
            console.log(unicornsJSON[i])
            foundUnicorn = true
            break
        }
    }

    if (foundUnicorn) { res.json(unicornsJSON[i]); return }
    res.json({ msg: "not found" })
})

app.patch('/api/v1/unicorn/:id', (req, res) => {
    unicornsJSON = unicornsJSON.map(({ _id, ...aUnicorn }) => {
        if (_id == req.body._id) {
            console.log("Bingo!");
            return req.body
        } else
            return aUnicorn
        })
    res.send("Updated successfully!")
})

app.delete('/api/v1/unicorn/:id', (req, res) => {
    unicornsJSON = unicornsJSON.filter((element) => element._id != req.params.id)
    console.log(unicornsJSON)
    res.send("Deleted successfully?")
})
