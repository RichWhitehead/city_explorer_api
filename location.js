'use strict';

const superagent= require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

module.exports = handleLocation;

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
        console.log('test');
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
