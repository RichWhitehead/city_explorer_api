'use strict';

console.log('welcome to city explorer');

$('#search-form').on('submit', getData);

function getData(event) {
  event.preventDefault();
  let typedInCity = $('#city').val();

  const ajaxSettings = {
    method: 'get',
    dataType: 'json',
    data: { city: typedInCity },
  };

  // get the data
  $.ajax('http://localhost:3000/location', ajaxSettings)
    .then( location => {
      renderTitle(location);
      renderMap(location);
      renderRestaurants(location);
    });
}

function renderTitle(data) {
  let template = $('#title-template').html();
  let container = $('#title');
  container.html( Mustache.render(template, data) );
}

function renderMap(data) {
  let template = $('#map-template').html();
  let container = $('#map');
  container.html( Mustache.render(template, data));
}

function renderRestaurants(locationObject) {
  //restaurants
  let template = $('#restaurants-template').html(); // <li></li>
  let container = $('#restaurants'); // <ul></ul>

  const ajaxSettings = {
    method: 'get',
    dataType: 'json',
    data: locationObject,
  };

  $.ajax('http://localhost:3000/restaurants', ajaxSettings)
    .then( listOfRestaurants => {
      listOfRestaurants.forEach( restaurant => {
        container.append(Mustache.render(template, restaurant));
      });
    });
}