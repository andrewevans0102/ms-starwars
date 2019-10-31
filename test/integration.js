const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../server');
const should = chai.should();
const expect = chai.expect;
// starwars mocks
const starwarsFilmListMock = require('../mocks/starwars/film_list.json');
const starwarsANewHopeFilmMock = require('../mocks/starwars/a_new_hope_film.json');
const starwarsLukeSkywalkerPeopleMock = require('../mocks/starwars/luke_skywalker.json');
const starwarsTattoinePlanetMock = require('../mocks/starwars/tattoine.json');
const starwarsStarshipMock = require('../mocks/starwars/cr90_corvette.json');
const starwarsVehicleMock = require('../mocks/starwars/sand_crawler.json');
const starwarsSpeciesMock = require('../mocks/starwars/human.json');

describe('GET /films-list', () => {
  it('should return a list of films when called', done => {
    chai
      .request(app)
      .get('/films-list')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(starwarsFilmListMock);
        done();
      });
  });
});

describe('GET /film/:episode', () => {
  it('should return film information for A New Hope Episode 4 when called', done => {
    const episode = '4';
    chai
      .request(app)
      .get('/film/' + episode)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(starwarsANewHopeFilmMock);
        done();
      });
  });
});

describe('GET /people/:id', () => {
  it('should return people information for Luke Skywalker when called', done => {
    const peopleId = '1';
    chai
      .request(app)
      .get('/people/' + peopleId)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(starwarsLukeSkywalkerPeopleMock);
        done();
      });
  });
});

describe('GET /planet/:id', () => {
  it('should return planet information for Tattoine when called', done => {
    const planetId = '1';
    chai
      .request(app)
      .get('/planet/' + planetId)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(starwarsTattoinePlanetMock);
        done();
      });
  });
});

describe('GET /starship/:id', () => {
  it('should return starship information when called', done => {
    const starshipId = '2';
    chai
      .request(app)
      .get('/starship/' + starshipId)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(starwarsStarshipMock);
        done();
      });
  });
});

describe('GET /vehicle/:id', () => {
  it('should return vehicle information when called', done => {
    const vehicleId = '4';
    chai
      .request(app)
      .get('/vehicle/' + vehicleId)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(starwarsVehicleMock);
        done();
      });
  });
});

describe('GET /species/:id', () => {
  it('should return species information when called', done => {
    const speciesId = '1';
    chai
      .request(app)
      .get('/species/' + speciesId)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.deep.equal(starwarsSpeciesMock);
        done();
      });
  });
});
