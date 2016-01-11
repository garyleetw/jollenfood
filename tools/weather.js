var express = require('express');
var mongoose = require('mongoose');
var config = require('../config');
var request = require('request');

// create express app
var app = express();

// keep reference to config
app.config = config;

// setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
});

// config data models
require('../models')(app, mongoose);

// http request
var getWeather = function() {
  request
    ('http://api.openweathermap.org/data/2.5/weather?q=Paris&APPID=2ab10d1d7c261f5cb373916cc1cf107f'
    , function(error, response, body) {
      console.log(body);

      var obj = JSON.parse(body);

      var fieldsToSet = {
  	    coord: {
  	      lon: obj.coord.lon,
  	      lat: obj.coord.lat
  	    },
  	    main: {
  	    	temp: obj.main.temp,
  	    	humidity: obj.main.humidity
  		}
      };
      
      app.db.models.Weather.create(fieldsToSet, function(err, weather) {
        if (err) {
        	console.log('... err');
          return;
        }

        console.log('... Saved.');
        console.log(weather);
      });
  });
};

setInterval(getWeather, 60000);
