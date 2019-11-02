const express = require('express');
const app = express();
const rp = require('request-promise');
const port = process.env.PORT || 1122;
const cors = require('cors');
app.use(cors({ origin: true }));
const util = require('./helpers/util');
const starwars = require('./controllers/starwars');
const flatCache = require('flat-cache');
let cache = flatCache.load('starwarsCache', './cache');

/**
 * middleware to log requests
 * @param  {object}   req  request
 * @param  {object}   res  response
 * @param  {function} next callback
 */
const requestTime = function(req, res, next) {
  req.requestTime = Date.now();
  console.log('method ' + req.method + ' and url ' + req.url);
  console.log('request came across at ' + req.requestTime);
  next();
};
app.use(requestTime);

/**
 * middleware to cache responses
 * code taken from scotch.io tutorial here
 * https://scotch.io/tutorials/how-to-optimize-node-requests-with-simple-caching-strategies
 * Additionally, this method does not update the cache file (notice the true value being passed to the save call).
 * This is fine since the data does not change frequently.
 * A good future improvement would be to build in a cache refresh here.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
let cacheMiddleware = (req, res, next) => {
  let key = '__express__' + req.url;
  let cacheContent = cache.getKey(key);
  if (cacheContent) {
    res.send(JSON.parse(cacheContent));
  } else {
    res.sendResponse = res.send;
    res.send = body => {
      cache.setKey(key, body);
      cache.save(true);
      res.sendResponse(body);
    };
    next();
  }
};
app.use(cacheMiddleware);

/**
 * Passthrough to the films route in SWAPI.
 * @return {array} array of star wars films
 */
app.get('/films-list', async (req, res) => {
  try {
    const filmList = await starwars.filmList();
    res.status(200).send(filmList);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * Retrieves all the data for a specific film based on episode number (and not release order)
 * @param {string} episode episode number
 * @return {object} metadata about the star wars film specified in the parameters
 */
app.get('/film/:episode', async (req, res) => {
  try {
    const filmId = util.translateEpisode(req.params.episode);
    const film = await starwars.film(filmId);
    res.status(200).send(film);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * Passthrough for people route in SWAPI.
 * @param {string} id id of person in SWAPI
 * @return {object} metadata of person selected
 */
app.get('/people/:id', async (req, res) => {
  try {
    const person = await starwars.people(req.params.id);
    res.status(200).send(person);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Passthrough for planet route in SWAPI.
 * @param {string} id id of planet in SWAPI
 * @return {object} metadata of planet selected
 */
app.get('/planet/:id', async (req, res) => {
  try {
    const planet = await starwars.planets(req.params.id);
    res.status(200).send(planet);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Passthrough for starship route in SWAPI.
 * @param {string} id id of starship in SWAPI
 * @return {object} metadata of starship selected
 */
app.get('/starship/:id', async (req, res) => {
  try {
    const starship = await starwars.starship(req.params.id);
    res.status(200).send(starship);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

/**
 * Passthrough for call to vehicle route in SWAPI.
 * @param {string} id id of vehicle in SWAPI
 * @return {object} metadata of vehicle selected
 */
app.get('/vehicle/:id', async (req, res) => {
  try {
    const vehicle = await starwars.vehicles(req.params.id);
    res.status(200).send(vehicle);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/**
 * Passthrough for call to species route in SWAPI.
 * @param {string} id id of species in SWAPI
 * @return {object} metadata of species selected
 */
app.get('/species/:id', async (req, res) => {
  try {
    const species = await starwars.species(req.params.id);
    res.status(200).send(species);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port);

module.exports = app;
