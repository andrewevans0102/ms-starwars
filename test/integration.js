const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../server');
const should = chai.should();
const expect = chai.expect;
// starwars mocks
const starwarsFilmListMock = require('../mocks/starwars/film_list.json');

// const metroStationListMock = require('../mocks/metro/station-list.json');
// const metroStationInformationMock = require('../mocks/metro/station-information.json');
// const metroStationHoursMock = require('../mocks/metro/station-hours.json');
// const metroArrivalTimesMock = require('../mocks/metro/arrival-times.json');
// const metroArrivalTimesC02Mock = require('../mocks/metro/C02-times.json');
// const metroStationRouteMock = require('../mocks/metro/station-route.json');

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

// describe('GET /film/:episode', () => {

// });

// describe('GET /people/:id', () => {

// });

// describe('GET /planet/:id', () => {

// });

// describe('GET /starship/:id', () => {

// });

// describe('GET /vehicle/:id', () => {

// });

// describe('GET /species/:id', () => {

// });

//   it('should return silver line station list when called with line code SV', done => {
//     chai
//       .request(app)
//       .get('/station-list?LineCode=SV')
//       .end((err, res) => {
//         res.should.have.status(200);
//         expect(res.body).to.deep.equal(metroStationListMock);
//         done();
//       });
//   });

//   it('should return a 500 and error message when called with invalid line code', done => {
//     chai
//       .request(app)
//       .get('/station-list?LineCode=CHEWBACCA')
//       .end((err, res) => {
//         // error is just to signify to http chai to close the test here
//         // https://www.chaijs.com/plugins/chai-http/
//         res.should.have.status(500);
//         expect(res.error.text).to.deep.equal(
//           'LineCode must be RD, BL, YL, OR, GR, or SV'
//         );
//         done();
//       });
//   });
// });
