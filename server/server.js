const express = require('express')
const app = express()
const https = require('https');
const bodyparser = require("body-parser");

const mongoose = require('mongoose');

var cors = require('cors')
app.use(cors())

mongoose.connect("mongodb://localhost:27017/test",
 {useNewUrlParser: true, useUnifiedTopology: true});
const citySchema = new mongoose.Schema({
    name: String,
    temperature: Number,
    description: String
});
const cityModel = mongoose.model("cities", citySchema);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(express.static('./public'));


app.listen(5000, function(err) {
    if (err) console.log(err);
})

// Routes //

app.get('/contact', function(req, res) {
    res.send('Hi, where is my email!?')
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
  // res.send("post req received" + req.body.cityName);
  var apikey = "8fbb8ddb351860ae5fac593696e9a2c9";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + req.body.cityName + "&units=metric&appid=" + apikey

  https.get(url, function(https_res) {
    https_res.on("data", function(data) {
      res.write("<h1> " + req.body.cityName + " weather is " + JSON.parse(data).weather[0].description) + "</h1>";
      res.write("<h1> " + req.body.cityName + " temp is " + JSON.parse(data).main.temp) + "</h1>";

      console.log(JSON.parse(data).weather[0].icon );
      res.write('  <img src="' + "http://openweathermap.org/img/wn/" + JSON.parse(data).weather[0].icon + '.png"' + "/>");
      res.send();
    })
  });

})

app.get('/cities/:city_name', function(req, res) {
  console.log("received a request for "+ req.params.city_name);
  cityModel.find({name: req.params.city_name}, function(err, cities){
      if (err){
        console.log("Error " + err);
      }else{
        console.log("Data "+ JSON.stringify(cities));
      }
      res.send(JSON.stringify(cities));
  });
})
app.get('/cities', function(req, res) {
  cityModel.find({}, function(err, cities){
      if (err){
        console.log("Error " + err);
      }else{
        console.log("Data "+ JSON.stringify(cities));
      }
      res.send(JSON.stringify(cities));
  });
})

app.put("/insert", function(req, res){
  cityModel.create({
    name : req.body.name,
    temperature : req.body.temperature,
    description: req.body.description
  }, function(err, data){
    if(err) console.log(err);
    else
    console.log(data);
    res.send("All good! Inserted.")
  });
})

app.delete("/delete/:city_name", function(req, res){
  cityModel.remove({
    name : req.body.name
  }, function(err, data){
    if(err) console.log(err);
    else
    console.log(data);
    res.send("All good! Delteted.")
  });
})

json_cities = require('./data.js');

app.get('/cities_from_json_file', function (req, res) {
  res.send(json_cities.list);
})


app.get('/cities_from_json_file/:city_name', function (req, res) {

  res.send(json_cities.list.filter(function(i_){
    return i_.name == req.params.city_name;
  }));

})

function map_f(i_) {
  return i_["tempreture"]

}
app.get('/cities_from_json_file/:city_name', function (req, res) {

  res.send(json_cities.list.filter(function(i_){
    return i_.name == req.params.city_name;
  }).map(map_f));

})

function map_f(i_) {
  return i_["tempreture"]

}
app.get('/cities_from_json_file/:city_name', function (req, res) {

  res.send(json_cities.list.filter(function(i_){
    return i_.name == req.params.city_name;
  }).map(map_f));

})
