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
    ('http://172.20.10.5/1/weather'
    , function(error, response, body) {
      console.log(body);

      var obj = JSON.parse(body);

      var fieldsToSet = {
  	    coord: {
  	      lon: obj.lon,
  	      lat: obj.lat
  	    },
  	    main: {
  	    	temp: obj.value,
  	    	humidity: 0 
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

setInterval(getWeather, 10000);
