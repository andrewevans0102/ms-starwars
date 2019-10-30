const swapi = require('../apis/swapi');
const util = require('../helpers/util');
const wrapper = require('../helpers/wrapper');

/**
 * controller for all films route
 * @return {Promise}
 */
const filmList = async () => {
  const swapiResponse = await swapi.films();
  const filmList = [];
  swapiResponse.forEach(responseFilm => {
    // destructure only the fields that do not have urls in them
    let {
      characters,
      planets,
      species,
      starships,
      vehicles,
      url,
      ...film
    } = responseFilm;
    filmList.push(film);
  });
  return filmList;
};

/**
 * controller for specific film route
 * @param  {string}  filmId
 * @return {Promise}
 */
const film = async filmId => {
  const swapiResponse = await swapi.film(filmId);
  let {
    characters,
    planets,
    starships,
    vehicles,
    species,
    url,
    ...film
  } = swapiResponse;

  // with the object defined add arrays here
  film.characters = [];
  film.planets = [];
  film.starships = [];
  film.vehicles = [];
  film.species = [];

  const promises = [];
  // people
  characters.forEach(characterUrl => {
    wrapper.people(characterUrl, promises, film.characters);
  });
  // planets
  planets.forEach(planetUrl => {
    wrapper.planet(planetUrl, promises, film.planets);
  });
  // starships
  starships.forEach(starshipUrl => {
    wrapper.starship(starshipUrl, promises, film.starships);
  });
  // vehicles
  vehicles.forEach(vehicleUrl => {
    wrapper.vehicle(vehicleUrl, promises, film.vehicles);
  });
  // species
  species.forEach(speciesUrl => {
    wrapper.species(speciesUrl, promises, film.species);
  });
  await Promise.all(promises);

  return film;
};

/**
 * controller for people route
 * @param  {string}  peopleId
 * @return {Promise}
 */
const people = async peopleId => {
  const swapiResponse = await swapi.people(peopleId);
  let { films, species, vehicles, starships, url, ...person } = swapiResponse;
  person.films = [];
  person.species = [];
  person.vehicles = [];
  person.starships = [];

  const promises = [];
  // films
  films.forEach(filmsUrl => {
    wrapper.films(filmsUrl, promises, person.films);
  });
  // species
  species.forEach(speciesUrl => {
    wrapper.species(speciesUrl, promises, person.species);
  });
  // vehicles
  vehicles.forEach(vehicleUrl => {
    wrapper.vehicle(vehicleUrl, promises, person.vehicles);
  });
  // starships
  starships.forEach(starshipUrl => {
    wrapper.starship(starshipUrl, promises, person.starships);
  });
  await Promise.all(promises);

  return person;
};

/**
 * controller for planets route
 * @param  {string}  planetId
 * @return {Promise}
 */
planets = async planetId => {
  const swapiResponse = await swapi.planet(planetId);
  let { residents, films, url, ...planet } = swapiResponse;
  planet.residents = [];
  planet.films = [];

  const promises = [];
  // people
  residents.forEach(characterUrl => {
    wrapper.people(characterUrl, promises, planet.residents);
  });
  // films
  films.forEach(filmsUrl => {
    wrapper.films(filmsUrl, promises, planet.films);
  });
  await Promise.all(promises);

  return planet;
};

/**
 * controller for starship route in SWAPI
 * @param  {string}  starshipId
 * @return {Promise}
 */
const starship = async starshipId => {
  const swapiResponse = await swapi.starship(starshipId);
  let { films, pilots, url, ...starship } = swapiResponse;
  starship.pilots = [];
  starship.films = [];

  const promises = [];
  films.forEach(filmsUrl => {
    wrapper.films(filmsUrl, promises, starship.films);
  });
  pilots.forEach(pilotsUrl => {
    wrapper.people(pilotsUrl, promises, starship.pilots);
  });
  await Promise.all(promises);

  return starship;
};

/**
 * controller for vehicles route
 * @param  {string}  vehicleId
 * @return {Promise}
 */
const vehicles = async vehicleId => {
  const swapiResponse = await swapi.vehicle(vehicleId);
  let { pilots, films, url, ...vehicle } = swapiResponse;
  vehicle.pilots = [];
  vehicle.films = [];

  const promises = [];
  pilots.forEach(characterUrl => {
    wrapper.people(characterUrl, promises, vehicle.pilots);
  });
  films.forEach(filmsUrl => {
    wrapper.films(filmsUrl, promises, vehicle.films);
  });
  await Promise.all(promises);

  return vehicle;
};

/**
 * controller for species route
 * @param  {string}  speciesId
 * @return {Promise}
 */
const species = async speciesId => {
  const swapiResponse = await swapi.species(speciesId);
  let { people, films, homeworld, url, ...species } = swapiResponse;
  species.people = [];
  species.films = [];
  species.homeworld = '';

  const promises = [];
  // single call to planet endpoint so not wrapping in helper method here
  const homeworldId = util.getId(homeworld);
  promises.push(
    swapi.planet(homeworldId).then(response => {
      species.homeworld = {
        name: response.name,
        id: util.getId(response.url)
      };
    })
  );
  // people
  people.forEach(characterUrl => {
    wrapper.people(characterUrl, promises, species.people);
  });
  // films
  films.forEach(filmsUrl => {
    wrapper.films(filmsUrl, promises, species.films);
  });
  await Promise.all(promises);

  return species;
};

module.exports = {
  filmList,
  film,
  people,
  planets,
  starship,
  vehicles,
  species
};
