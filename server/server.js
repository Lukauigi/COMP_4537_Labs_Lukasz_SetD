const express = require('express')
const app = express()


app.listen(8000, function(err) {
    if (err) console.log(err);
})


// app.get('/', function(req, res) {
//     res.send('GET request to homepage')
// })


app.get('/contact', function(req, res) {
    res.send('Hi, where is my email!?')
})


app.use(express.static('./public'));


const https = require('https');

app.get("/", function(req, res) {
  var cityName = 'Vancouver';
  var apikey = "8fbb8ddb351860ae5fac593696e9a2c9"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apikey

  https.get(url, function(https_res) {
      https_res.on("data", function(data) {  
      res.write("<h1> " + cityName + " weather is " + JSON.parse(data).weather[0].description) + "</h1>";
      res.write("<h1> " + cityName + " temp is " + JSON.parse(data).main.temp) + "</h1>";

      // console.log(JSON.parse(data).weather[0].icon );
      res.write('  <img src="' + "http://openweathermap.org/img/wn/" + JSON.parse(data).weather[0].icon + '.png"' + "/>");
      res.send();
    })
  });

})