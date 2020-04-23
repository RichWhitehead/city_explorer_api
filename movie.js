'use strict';

const superagent = require('superagent');

module.exports = handleMovies;

function handleMovies(req, res) {
  let key = process.env.MOVIE_API_KEY;
  let region = req.query.search_query;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${region}&$include_adult=false`;

  superagent.get(url)
    .then(data => {
      let movieData = data.body.results.map( movie => {
        return new Movie(movie);
      });
      res.json(movieData);
    });
}

function Movie (movie) {
  this.title = movie.title;
  this.overview = movie.overview;
  this.average_votes = movie.vote_average;
  this.total_votes= movie.vote_count;
  this.image_url= `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  this.popularity = movie.popularity;
  this.released_on= movie.release_date;
}

