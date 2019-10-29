const express = require('express');
const app = express();
const rp = require('request-promise');
const port = process.env.PORT || 1122;
const cors = require('cors');
app.use(cors({ origin: true }));
const swapi = require('./apis/swapi');

/**
 * middleware to log requests
 * @param  {[type]}   req  request
 * @param  {[type]}   res  response
 * @param  {Function} next callback
 * @return {[type]}
 */
const requestTime = function(req, res, next) {
  req.requestTime = Date.now();
  console.log('method ' + req.method + ' and url ' + req.url);
  console.log('request came across at ' + req.requestTime);
  next();
};
app.use(requestTime);

app.get('/hello-world', async (req, res) => {
  res.status(200).send('hello world');
});

app.get('/films-list', async (req, res) => {
  try {
    const response = await swapi.films();
    const filmList = [];
    response.forEach(film => {
      filmList.push({
        title: film.title,
        episode: film.episode_id,
        director: film.director,
        producer: film.producer,
        release_date: film.release_Date,
        created: film.created,
        edited: film.edited,
        opening_crawl: film.opening_crawl,
        film_url: film.url
      });
    });
    res.status(200).send(filmList);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get('/film/:id', async (req, res) => {
  try {
    const film = {
      title: '',
      episode_id: '',
      opening_crawl: '',
      director: '',
      producer: '',
      release_date: '',
      characters: [],
      planets: [],
      starships: [],
      vehicles: [],
      species: [],
      created: '',
      edited: '',
      url: ''
    };
    const filmLookup = await swapi.film(req.params.id);
    film.title = filmLookup.title;
    film.episode_id = filmLookup.episode_id;
    film.opening_crawl = filmLookup.opening_crawl;
    film.director = filmLookup.director;
    film.producer = filmLookup.producer;
    film.release_date = filmLookup.release_date;
    film.created = filmLookup.created;
    film.edited = filmLookup.edited;
    film.url = filmLookup.url;
    // // characters
    // for (const character of filmLookup.characters) {
    //   const splitUrl = character.split('/');
    //   const id = splitUrl[splitUrl.length - 2];
    //   const response = await swapi.people(id);
    //   film.characters.push(response);
    // }
    await Promise.all(
      filmLookup.characters.map(async character => {
        const splitUrl = character.split('/');
        const id = splitUrl[splitUrl.length - 2];
        const response = await swapi.people(id);
        film.characters.push(response);
      })
    );
    // for (let i; i < filmLookup.characters.length; i++) {
    //   const character = filmLookup.characters[i];
    //   const splitUrl = character.split('/');
    //   const id = splitUrl[splitUrl.length - 2];
    //   const response = await swapi.people(id);
    //   film.characters.push(response);
    // }
    // // planets
    // filmLookup.planets.forEach(async planet => {
    //   const splitUrl = planet.split('/');
    //   const id = splitUrl[splitUrl.length - 2];
    //   const response = await swapi.planet(id);
    //   film.planets.push(response);
    // });
    // // starships
    // filmLookup.starships.forEach(async starship => {
    //   const splitUrl = starship.split('/');
    //   const id = splitUrl[splitUrl.length - 2];
    //   const response = await swapi.starship(id);
    //   film.starships.push(response);
    // });
    // // vehicles
    // filmLookup.vehicles.forEach(async vehicle => {
    //   const splitUrl = vehicle.split('/');
    //   const id = splitUrl[splitUrl.length - 2];
    //   const response = await swapi.vehicle(id);
    //   film.vehicles.push(response);
    // });
    // // species
    // filmLookup.species.forEach(async value => {
    //   const splitUrl = value.split('/');
    //   const id = splitUrl[splitUrl.length - 2];
    //   const response = await swapi.vehicle(id);
    //   film.species.push(response);
    // });
    res.status(200).send(film);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.listen(port);

module.exports = app;
