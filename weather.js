'use strict';

const superagent = require('superagent');

module.exports = handleWeather;

function handleWeather(request, response) {
  let key = process.env.DARK_SKY_KEY;
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let url = `https://api.darksky.net/forecast/${key}/${lat},${lon}`;

  superagent.get(url)
    .then(data => {
      let weatherData = data.body.daily.data.map( day => {
        return new DailyForecast(day);
      });
      response.json(weatherData);
    });
}

function DailyForecast(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time*1000).toUTCString();
}
