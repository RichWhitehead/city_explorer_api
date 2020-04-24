'use strict';

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');

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
app.get('/movies', handleMovies);
app.get('/yelp', handleRestaurants);

app.listen( PORT, () => console.log('Server is up on', PORT));
