'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const pg = require('pg');
// const superagent = require('superagent');
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

const handleLocation = require('./location');
const handleWeather = require('./weather');
const handleTrails = require('./trails');
const handleRestaurants = require('./restaurants');
const handleMovies = require('./movie');

const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT;
const app = express();

client.connect();
app.use(cors());


app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);
app.get('/movie', handleMovies);
app.get('/yelp', handleRestaurants);

app.listen( PORT, () => console.log('Server is up on', PORT));
