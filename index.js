const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const { OPENWEATHER_KEY }  = require('./constants.js');

const app = new express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index', { weather: null, error: null });
})

app.post('/', function(req, response) {
  const { city } = req.body;
  const openWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${OPENWEATHER_KEY}`;
  request(openWeatherUrl, function(err, res, body) {
    if(err) {
      response.render('index', { weather: null, error: "Error! Please try again" });
    } else {
      const weatherResult = JSON.parse(body);
      if(!weatherResult.main) {
        response.render('index', { weather: null, error: "Error!, Please try again" });
      } else {
        const weeatherTxt = `It's ${weatherResult.main.temp} degrees in ${weatherResult.name}`;
        response.render('index', { weather: weeatherTxt, error: null });
      }
    }
  });
})

app.listen(8080, function() {
  console.log('listening')
})