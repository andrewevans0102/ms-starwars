/**
 * This was a common thing I was doing to manipulate the URLs returned from SWAPI.
 * @param {string} originalUrl
 */
const getId = originalUrl => {
  const splitUrl = originalUrl.split('/');
  const id = splitUrl[splitUrl.length - 2];
  return id;
};

/**
 * The SWAPI indexes films in terms of when they were released.
 * So episode 4 (A New Hope) is indexed as "1"
 * Just out of personal preferance, I decided to translate these values so I would just
 * have to remember the episode number (rather than the release order).
 * This is entirley my personal preferance, and just wanted to put the disclaimer here.
 *
 * @param {string} episodeNumber
 */
const translateEpisode = episodeNumber => {
  let id = 0;
  const episodeInt = parseInt(episodeNumber);
  switch (episodeInt) {
    case 1:
      // phantom menace
      id = 4;
      break;
    case 2:
      // attack of the clones
      id = 5;
      break;
    case 3:
      // Revenge of the Sith
      id = 6;
      break;
    case 4:
      // A New hope
      id = 1;
      break;
    case 5:
      // Empire Strikes Back
      id = 2;
      break;
    case 6:
      // Return of the Jedi
      id = 3;
      break;
    case 7:
      // Force Awakens
      id = 7;
      break;
    default:
      // default to A New Hope
      id = 4;
      break;
  }
  return id;
};

module.exports = {
  getId,
  translateEpisode
};
