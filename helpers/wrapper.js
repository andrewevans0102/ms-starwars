const util = require('./util');
const swapi = require('../apis/swapi');

/**
 * wrapper for promises created to call SWAPI people route
 * @param  {string} peopleUrl
 * @param  {array} promises array of promises to append new promise to
 * @param  {object} output output that will be appended to after promise completes
 */
const people = (peopleUrl, promises, output) => {
  const id = util.getId(peopleUrl);
  promises.push(
    swapi
      .people(id)
      .then(response => {
        output.push({
          name: response.name,
          id: util.getId(response.url)
        });
      })
      .catch(error => {
        console.log('error on people call with id ' + id);
        throw error;
      })
  );
};

/**
 * wrapper for promises created to call SWAPI planet route
 * @param  {string} planetUrl
 * @param  {array} promises array of promises to append new promise to
 * @param  {object} output output that will be appended to after promise completes
 */
const planet = (planetUrl, promises, output) => {
  const id = util.getId(planetUrl);
  promises.push(
    swapi
      .planet(id)
      .then(response => {
        output.push({
          name: response.name,
          id: util.getId(response.url)
        });
      })
      .catch(error => {
        console.log('error on planet call with id ' + id);
        throw error;
      })
  );
};

/**
 * wrapper for promises created to call SWAPI starship route
 * @param  {string} starshipUrl
 * @param  {array} promises array of promises to append new promise to
 * @param  {object} output output that will be appended to after promise completes
 */
const starship = (starshipUrl, promises, output) => {
  const id = util.getId(starshipUrl);
  promises.push(
    swapi
      .starship(id)
      .then(response => {
        output.push({
          name: response.name,
          id: util.getId(response.url)
        });
      })
      .catch(error => {
        console.log('error on starship call with id ' + id);
        throw error;
      })
  );
};

/**
 * wrapper for promises created to call SWAPI vehicle route
 * @param  {string} vehicleUrl
 * @param  {array} promises array of promises to append new promise to
 * @param  {object} output output that will be appended to after promise completes
 */
const vehicle = (vehicleUrl, promises, output) => {
  const id = util.getId(vehicleUrl);
  promises.push(
    swapi
      .vehicle(id)
      .then(response => {
        output.push({
          name: response.name,
          id: util.getId(response.url)
        });
      })
      .catch(error => {
        console.log('error on vehicle call with id ' + id);
        throw error;
      })
  );
};

/**
 * wrapper for promises created to call SWAPI species route
 * @param  {string} speciesUrl
 * @param  {array} promises array of promises to append new promise to
 * @param  {object} output output that will be appended to after promise completes
 */
const species = (speciesUrl, promises, output) => {
  const id = util.getId(speciesUrl);
  promises.push(
    swapi
      .species(id)
      .then(response => {
        output.push({
          name: response.name,
          id: util.getId(response.url)
        });
      })
      .catch(error => {
        console.log('error on species call with id ' + id);
        throw error;
      })
  );
};

/**
 * wrapper for promises created to call SWAPI films route
 * @param  {string} filmsUrl
 * @param  {array} promises array of promises to append new promise to
 * @param  {object} output output that will be appended to after promise completes
 */
const films = (filmsUrl, promises, output) => {
  const id = util.getId(filmsUrl);
  promises.push(
    swapi
      .film(id)
      .then(response => {
        output.push({
          title: response.title,
          id: util.getId(response.url)
        });
      })
      .catch(error => {
        console.log('error on films call with id ' + id);
        throw error;
      })
  );
};

module.exports = {
  people,
  planet,
  starship,
  vehicle,
  species,
  films
};
