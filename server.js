'use strict';

/*
  The .env file has this in it:
  PORT=3000
*/
require('dotenv').config();

// globals

const cors = require('cors');
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT;
const app = express();
const pg = require('pg');
app.use(cors());

// connect to database
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', (error) => console.error('Connection Failure', error));

//empty cache for location nodemon


app.get('/location', handleLocation); //Handler function for location

function handleLocation( request, response ) {


  let city = request.query.city;
  const url = 'https://us1.locationiq.com/v1/search.php';
  const queryStringParams = {
    key: process.env.LOCATION_TOKEN,
    q: city,
    format: 'json',
    limit: 1,
  };

  const searchSQL = `SELECT * FROM locations WHERE search_query = $1`;
  const values = [city];
  client.query(searchSQL, values)
    .then( results => {
      console.log(results);
      if (results.rowCount >= 1 ){
        console.log('Response came from Database - Row count = ' + results.rowCount);
        response.json(results.rows[0]);

      } else {
        console.log("test");
        superagent.get(url)
          .query(queryStringParams)
          .then( data => {
            let locationData = data.body[0];
            console.log(locationData);
            let location = new Location(city, locationData);
            console.log(city + ' came from API');
            const addSQL = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES($1, $2, $3, $4)`;
            response.json(location)
            ;
            let VALUES = [location.search_query, location.formatted_query, location.latitude, location.longitude];
            client.query(addSQL, VALUES)
              .then(result => {
                console.log(VALUES);
                response.json(location);
              });
          });
      }
    })
    .catch(e => console.log (e));

}


function Location(city, data) {
  this.search_query = city;
  this.formatted_query = data.display_name;
  this.latitude = data.lat;
  this.longitude = data.lon;
}


app.get('/weather', handleWeather); // Handler function for weather

function handleWeather(request, response) {
  try {

    // use darksky fake data
    // eventually will be an api call
    // let weatherData = require('./data/darksky.json');

    const url = 'https://api.darksky.net/forecast/';
    let key = process.env.DARKSKY_TOKEN;
    let lat = request.query.latitude;
    let lon = request.query.longitude;

    // user-key
    let newUrl = `${url}${key}/${lat},${lon}`;

    superagent.get(newUrl)
      .then( data => {
        let listOfDays = data.body.daily.data.map( day => {
          return new Weather(day);
        });
        response.json(listOfDays);
      }).catch( error => {
        console.log(error);
      });
  }
  catch(error) {
    let errorObject = {
      status: 500,
      responseText: 'john is ugly or something',
    };
    response.status(500).json(errorObject);
  }
}

function Weather(data) {
  this.time = data.time; // format to date (not epoch)
  this.forecast = data.summary;
}

app.get('/trails', handleTrails);

function handleTrails (request, response){
  try {
    const trailsUrl = 'https://www.hikingproject.com/data/get-trails/';
    let queryStringParams = {
      key: process.env.TRAILS_TOKEN,
      lat: request.query.latitude,
      lon: request.query.longitude,
      maxResult: 10,
    };
    superagent.get (trailsUrl)
      .query(queryStringParams)
      .then(data => {
        let trailList = data.body.trails.map(trail => {
          return new HikingTrails(trail);
        });
        response.json(trailList);
      }).catch( error => {
        console.log(error);
      });
  }
  catch(error) {
    let errorObject = {
      status: 500,
      responseText: 'john is ugly or something',
    };
    response.status(500).json(errorObject);
  }
}

function HikingTrails(trail) {
  this.name =trail.name;
  this.location = trail.location;
  this.length = trail.stars;
  this.stars = trail.stars;
  this.star_votes = trail.starVotes;
  this.summary = trail.summary;
  this.trail_url = trail.url;
  this.conditions = trail.conditionDetails;
  this.condition_date = trail.conditionDate.substring(0, 10);
  this.condition_time = trail.conditionDate.substring(11, 20);
}


app.listen( PORT, () => console.log('Server up on', PORT));


