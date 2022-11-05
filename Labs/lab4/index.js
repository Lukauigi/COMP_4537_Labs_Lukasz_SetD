const express = require('express')
const mongoose = require('mongoose')

const app = express()
const port = 5000

app.listen(port, async () => {
  try {
    await mongoose.connect('mongodb+srv://lukasz:MGgG7exYk9h86YDz@cluster0.6rpvvsp.mongodb.net/?retryWrites=true&w=majority')
  } catch (error) {
    console.log('db error');
  }
  console.log(`Example app listening on port ${port}`)
}
)


const { Schema } = mongoose;

const unicornSchema = new Schema({
  "name": String, // String is shorthand for {type: String}
  "weight": Number,
  "loves": [String],
  "gender": {
    enum: ["f", "m"]
  },
  "vampires": Number,
  "dob": Date
});

const unicornModel = mongoose.model('unicorns', unicornSchema); // unicorns is the name of the collection in db

app.use(express.json())

app.get('/api/v2/unicorns', (req, res) => {
  unicornModel.find({})
    .then(docs => {
      console.log(docs)
      res.json(docs)
    })
    .catch(err => {
      console.error(err)
      res.json({ msg: "db reading .. err.  Check with server devs" })
    })
})


app.post('/api/v2/unicorn', (req, res) => {
  unicornModel.create(req.body, function (err) {
    if (err) console.log(err);
    // saved!
  });
  res.json(req.body)
})  

app.get('/api/v2/unicorn/:id', (req, res) => {
  console.log(req.params.id);
  unicornModel.find({ _id: mongoose.Types.ObjectId(`${req.params.id}`) })
    .then(doc => {
      console.log(doc)
      res.json(doc)
    })
    .catch(err => {
      console.error(err)
      res.json({ msg: "db reading .. err.  Check with server devs" })
    })
})

app.patch('/api/v2/unicorn/:id', (req, res) => {
  const { _id, ...rest } = req.body;
  unicornModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: {...rest} }, { runValidators: true }, function (err, res) {
    if (err) console.log(err)
    console.log(res)
  });

  res.send("Updated successfully!")
})

app.delete('/api/v2/unicorn/:id', (req, res) => {
  unicornModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, result) {
    if (err) console.log(err);
    console.log(result);
  });

  res.send("Deleted successfully?")
})
