'use strict';

/*
  The .env file has this in it:
  PORT=3000
*/
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const superagent = require('superagent');

const PORT = process.env.PORT;

const app = express();
app.use(cors());



// Test Endpoint
// http://localhost:3000/test
app.get( '/test', (request, response) => {
  const name = request.query.name;
  response.send( `Hello, ${name}` );
});

app.get('/cats', (request, response) => {
  let type = request.query.type;
  let words = '';
  if ( type === 'calico' ) {
    words = 'You are a good person';
  }
  else {
    words = 'We do not have those';
  }



  response.send(words);
});

app.get('/location', handleLocation);

function handleLocation( request, response ) {
  try {
    let city = request.query.city;
    // eventually, get this from a real live API
    // But today, pull it from a file.

    // throw 'john is ugly or something';

    const url = 'https://us1.locationiq.com/v1/search.php';
    const queryStringParams = {
      key: process.env.LOCATION_TOKEN,
      q: city,
      format: 'json',
      limit: 1,
    };

    superagent.get(url)
      .query(queryStringParams)
      .then( data => {
        let locationData = data.body[0];
        console.log(locationData);
        let location = new Location(city, locationData);
        response.json(location);
      });
  }
  catch(error) {
    let errorObject = {
      status: 500,
      responseText: 'try again',
    };
    response.status(500).json(errorObject);
  }
}

function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
}

app.get('/weather', handleWeather);

function handleWeather(request, response) {
  try {
  // use darksky fake data
  // eventually will be an api call
  // let weatherData = require('./data/darksky.json');
    let listofDays = [];
    let url = 'https://api.darksky.net/forecast';
    let lat = request.query.latitude;
    let lon = request.query.longitude;

    // user-key rs

    superagent.get(url)
      .set('user-key', process.env.DARKSKY_TOKEN)
      .set('latitude', lat)
      .set('longitude', lon)
      .then( data => {
        data.daily.data.map( day => {
          let weather = new Weather(day);
          listofDays.push(weather);
        });
        response.json(listofDays);
      }).catch( error => console.log(error));

    // weatherData.daily.data.map( day => {
    //   let weather = new Weather(day);
    //   listofDays.push(weather);
    // })

  }


  catch(error) {
    let errorObject = {
      status: 500,
      responseText: 'john is ugly or something',
    };
    response.status(500).json(errorObject);
  }
  
/* Restaurants
  {
    "restaurant": "Serious Pie",
    "cuisines": "Pizza, Italian",
    "locality": "Belltown"
  },
*/

app.get('/location', handleLocation);

function handleLocation( request, response ) {
  try {
    let city = request.query.city;
    // eventually, get this from a real live API
    // But today, pull it from a file.
    let locationData = require('./data/geo.json');
    let location = new Location(city, locationData[0]);
    throw 'you hit a roadblock';
    response.json(location);
  }
  catch(error) {
    let errorObject = {
      status: 500,
      responseText: error,
    };
    response.status(500).json(errorObject);
  }
}

function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
}






app.get('/weather', handleWeather);

function handleWeather(request, response) {
  // use darksky fake data
  // eventually will be an api call
  let weatherData = require('./data/darksky.json');
  let listofDays = [];

  weatherData.daily.data.forEach( day => {
    let weather = new Weather(day);
    listofDays.push(weather);
  });
  response.json(listofDays);
}


function Weather(data) {
  this.time = data.time;
  this.forecast = data.summary;
}

function Weather(data) {
  this.time = data.time;
  this.forecast = data.summary;
}




app.listen( PORT, () => console.log('Server up on', PORT));