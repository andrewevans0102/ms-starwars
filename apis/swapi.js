const rp = require('request-promise');

/**
 * return all of the films
 * https://swapi.co/documentation#films
 */
const films = async () => {
  const options = {
    uri: 'https://swapi.co/api/films/',
    json: true
  };
  const response = await rp(options);
  const { results } = response;
  return results;
};

/**
 * return a specific film
 * @param {string} filmId
 */
const film = async filmId => {
  const options = {
    uri: `https://swapi.co/api/films/${filmId}`,
    json: true
  };
  const response = await rp(options);
  return response;
};

/**
 * return a specific person
 * @param {string} peopleId
 */
const people = async peopleId => {
  const options = {
    uri: `https://swapi.co/api/people/${peopleId}`,
    json: true
  };
  const response = await rp(options);
  return response;
};

/**
 * return a specific planet
 * @param {string} planetId
 */
const planet = async planetId => {
  const options = {
    uri: `https://swapi.co/api/planets/${planetId}`,
    json: true
  };
  const response = await rp(options);
  return response;
};

/**
 * return a specific species
 * @param {string} speciesId
 */
const species = async speciesId => {
  const options = {
    uri: `https://swapi.co/api/species/${speciesId}`,
    json: true
  };
  const response = await rp(options);
  return response;
};

/**
 * return a specific vehicle
 * @param {string} vehicleId
 */
const vehicle = async vehicleId => {
  const options = {
    uri: `https://swapi.co/api/vehicles/${vehicleId}`,
    json: true
  };
  const response = await rp(options);
  return response;
};

/**
 * return a specific starship
 * @param {string} starshipId
 */
const starship = async starshipId => {
  const options = {
    uri: `https://swapi.co/api/starships/${starshipId}`,
    json: true
  };
  const response = await rp(options);
  return response;
};

module.exports = {
  films,
  film,
  people,
  planet,
  species,
  vehicle,
  starship
};
