'use strict';

const superagent = require('superagent');

module.exports = handleRestaurants;

function handleRestaurants(req, res) {
  let key = process.env.YELP_TOKEN;
  let city = req.query.search_query;
  let url = `https://api.yelp.com/v3/businesses/search?location=${city}`;

  superagent.get (url)
    .set ('Authorization', `Bearer ${key}`)
    .then( data => {
      let restaurantsData = data.body.businesses.map( restaurant => {
        return new Restaurant(restaurant);
      });
      res.json(restaurantsData);
    });
}

function Restaurant (restaurant) {
  this.name= restaurant.name;
  this.image_url= restaurant.image_url;
  this.price= restaurant.price;
  this.rating= restaurant.rating;
  this.url = restaurant.url;
}
