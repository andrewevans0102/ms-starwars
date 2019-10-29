const express = require('express');
const app = express();
const rp = require('request-promise');
const port = process.env.PORT || 1122;
const cors = require('cors');
app.use(cors({ origin: true }));
const swapi = require('./apis/swapi');
const helper = require('./helper/helper');

// TODO
// refactor body of routes to controllers
// build unit tests for controllers
// build end to end tests for API endpoints
// comment out log steps

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
        opening_crawl: film.opening_crawl
      });
    });
    res.status(200).send(filmList);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get('/film/:episode', async (req, res) => {
  try {
    // translate film value for SWAPI API call
    const filmId = helper.translateEpisode(req.params.episode);
    
    // define film response object
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
      edited: ''
    };

    // retrieve metadata about the film
    const filmLookup = await swapi.film(filmId);
    film.title = filmLookup.title;
    film.episode_id = filmLookup.episode_id;
    film.opening_crawl = filmLookup.opening_crawl;
    film.director = filmLookup.director;
    film.producer = filmLookup.producer;
    film.release_date = filmLookup.release_date;
    film.created = filmLookup.created;
    film.edited = filmLookup.edited;
  
    // store all the promises in an array so they can be called in parallel
    const promises = [];

    // people
    for (const character of filmLookup.characters) {
      const id = helper.getId(character);
      promises.push(
        swapi.people(id)
          .then((response) => {    
            film.characters.push({            
              name: response.name,
              id: helper.getId(response.url)
            });
          })
          .catch((error) => {
            console.log('error on people call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }

    // planets
    for (const planet of filmLookup.planets) {
      const id = helper.getId(planet);
      promises.push(
        swapi.planet(id)
          .then((response) => {
            film.planets.push({
              name: response.name,
              id: helper.getId(response.url)
            });
          })
          .catch((error) => {
            console.log('error on planet call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }
    
    // starships
    for (const starship of filmLookup.starships) {
      const id = helper.getId(starship);
      promises.push(
        swapi.starship(id)
          .then((response) => {
            film.starships.push({
              name: response.name,
              id: helper.getId(response.url)
            })
          })
          .catch((error) => {
            console.log('error on starship call with id ' + id);
            console.log(error.message);
            throw error;
          })
        );
    }

    // vehicles
    for (const vehicle of filmLookup.vehicles) {
      const id = helper.getId(vehicle);
      promises.push(
        swapi.vehicle(id)
          .then((response) => {
            film.vehicles.push({
              name: response.name,
              id: helper.getId(response.url)
            })
          })
          .catch((error) => {
            console.log('error on vehicle call with id ' + id);
            console.log(error.message);
            throw error;            
          })
      );
    }

    // species
    for (const species of filmLookup.species) {
      const id = helper.getId(species);
      promises.push(
        swapi.species(id)
          .then((response) => {
            film.species.push({
              name: response.name,
              id: helper.getId(response.url)
            });
          })
          .catch((error) => {
            console.log('error on vehicle call with id ' + id);
            console.log(error.message);
            throw error;            
          })
      );
    }

    // call all the rest calls at the same time
    await Promise.all(promises);
    res.status(200).send(film);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// people
app.get('/people/:id', async (req, res) => {
  try {
    const response = await swapi.people(req.params.id);
    const person = {
      name: response.name,
      height: response.height,
      mass: response.mass,
      hair_color: response.hair_color,
      skin_color: response.skin_color,
      eye_color: response.eye_color,
      birth_year: response.birth_year,
      gender: response.gender,
      homeworld: response.homeworld,
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      created: response.created,
      edited: response.edited
    };

    // store all the promises in an array so they can be called in parallel
    const promises = [];

    // films
    for(const film of response.films) {
      const id = helper.getId(film);
      promises.push(
        swapi.film(id)
          .then((value) => {
            person.films.push({
              title: value.title,
              id: helper.getId(value.url)
            })
          })
          .catch((error) => {
            console.log('error on film call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }

    // species
    for(const species of response.species) {
      const id = helper.getId(species);
      promises.push(
        swapi.species(id)
          .then((value) => {
            person.species.push({
              name: value.name,
              id: helper.getId(value.url)
            })
          })
          .catch((error) => {
            console.log('error on species call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }

    // vehicles
    for(const vehicle of response.vehicles) {
      const id = helper.getId(vehicle);
      promises.push(
        swapi.vehicle(id)
          .then((value) => {
            person.vehicles.push({
              name: value.name,
              id: helper.getId(value.url)
            })
          })
          .catch((error) => {
            console.log('error on vehicle call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }

    // starships
    for(const starship of response.starships) {
      const id = helper.getId(starship);
      promises.push(
        swapi.starship(id)
          .then((value) => {
            person.starships.push({
              name: value.name,
              id: helper.getId(value.url)
            })
          })
          .catch((error) => {
            console.log('error on starship call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }

    // call all the promises in parallel
    await Promise.all(promises);

    res.status(200).send(person);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// planet
app.get('/planet/:id', async (req, res) => {
  try {
    const response = await swapi.planet(req.params.id);
    const planet = {
      name: response.name,
      rotation_period: response.rotation_period,
      orbital_period: response.orbital_period,
      diameter: response.diameter,
      climate: response.climate,
      gravity: response.gravity,
      terrain: response.terrain,
      surface_water: response.surface_water,
      population: response.population,
      residents: [],
      films: [],
      created: response.created,
      edited: response.edited
    };

    // store all the promises in an array so they can be called in parallel
    const promises = [];

    // people
    for(const resident of response.residents) {
      const id = helper.getId(resident);
      promises.push(
        swapi.people(id)
          .then((value) => {
            planet.residents.push({
              name: value.name,
              id: helper.getId(value.url)
            })
          })
          .catch((error) => {
            console.log('error on people call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }

    // films
    for(const film of response.films) {
      const id = helper.getId(film);
      promises.push(
        swapi.film(id)
          .then((value) => {
            planet.films.push({
              title: value.title,
              id: helper.getId(value.url)
            })
          })
          .catch((error) => {
            console.log('error on film call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }

    // call all the promises in parallel
    await Promise.all(promises);

    res.status(200).send(planet);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// starship
app.get('/starship/:id', async (req, res) => {
  try {
    const response = await swapi.starship(req.params.id);
    const starship = {
      name: response.name,
      model: response.model,
      manufacturer: response.manufacturer,
      cost_in_credits: response.cost_in_credits,
      length: response.length,
      max_atmosphering_speed: response.max_atmosphering_speed,
      crew: response.crew,
      passengers: response.passengers,
      cargo_capacity: response.cargo_capacity,
      consumables: response.consumables,
      hyperdrive_rating: response.hyperdrive_rating,
      MGLT: response.MGLT,
      starship_class: response.starship_class,
      // when testing saw consistent empty value for pilots so leaving blank here
      // pilots: []
      films: [],
      created: response.created,
      edited: response.edited
    };

    // store promises in one place to call in parallel
    const promises = [];

    // films
    for(const film of response.films) {
      const id = helper.getId(film);
      promises.push(
        swapi.film(id)
          .then((value) => {
            starship.films.push({
              title: value.title,
              id: helper.getId(value.url)
            })
          })
          .catch((error) => {
            console.log('error on film call with id ' + id);
            console.log(error.message);
            throw error;
          }
        )
      );
    }

    // call all promises in parallel
    await Promise.all(promises);

    res.status(200).send(starship);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// vehicle
app.get('/vehicle/:id', async (req, res) => {
  try {
    const response = await swapi.vehicle(req.params.id);
    const vehicle = {
      name: response.name,
      model: response.model,
      manufacturer: response.manufacturer,
      cost_in_credits: response.cost_in_credits,
      length: response.length,
      max_atmosphering_speed: response.max_atmosphering_speed,
      crew: response.crew,
      passengers: response.passengers,
      cargo_capacity: response.cargo_capacity,
      consumables: response.consumables,
      vehicle_class: response.vehicle_class,
      pilots: [],
      films: [],
      created: response.created,
      edited: response.edited
    };

    const promises = [];

    for(const pilot of response.pilots) {
      const id = helper.getId(pilot);
      promises.push(
        swapi.people(id)
          .then((value) => {
            vehicle.pilots.push({
              name: value.name,
              id: helper.getId(value.url)
            })
          })
      );
    }

    for(const film of response.films) {
      const id = helper.getId(film);
      promises.push(
        swapi.film(id)
          .then((value => {
            vehicle.films.push({
              title: value.title,
              id: helper.getId(value.url)
            })
          }))
      );
    }

    await Promise.all(promises);

    res.status(200).send(vehicle);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// species
app.get('/species/:id', async (req, res) => {
  try {
    const response = await swapi.species(req.params.id);
    const species = {
      name: response.name,
      classification: response.classification,
      designation: response.designation,
      average_height: response.average_height,
      skin_colors: response.skin_colors,
      hair_colors: response.hair_colors,
      eye_colors: response.eye_colors,
      average_lifespan: response.average_lifespan,
      homeworld: "",
      language: response.language,
      people: [],
      films: [],
      created: response.created,
      edited: response.edited
    };

    const promises = [];

    const homeworldId = helper.getId(response.homeworld);
    promises.push(
      swapi.planet(homeworldId)
        .then((response) => {
          species.homeworld = {
            name: response.name,
            id: helper.getId(response.url)
          }
        })
    );

    // people
    for(const person of response.people) {
      const id = helper.getId(person);
      promises.push(
        swapi.people(id)
          .then((value) => {
            species.people.push({
              name: value.name,
              id: helper.getId(value.url)
            })
          })
          .catch((error) => {
            console.log('error on people call with id ' + id);
            console.log(error.message);
            throw error;
          })
      );
    }

    for(const film of response.films) {
      const id = helper.getId(film);
      promises.push(
        swapi.film(id)
          .then((value => {
            species.films.push({
              title: value.title,
              id: helper.getId(value.url)
            })
          }))
      );
    }

    await Promise.all(promises);

    res.status(200).send(species);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port);

module.exports = app;
