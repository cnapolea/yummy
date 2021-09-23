const turf = require('turf');

module.exports = (restaurants, lon, lat) => {
  const restaurantsClient = [];

  restaurants.forEach((restaurant) => {
    const distanceToUser = turf.distance(
      turf.point(restaurant.position.coordinates),
      turf.point([lon, lat])
    );
    restaurantsClient.push([restaurant, distanceToUser]);
  });

  const sortedByDistance = restaurantsClient.sort((a, b) => {
    return a[1] - b[1];
  });

  return sortedByDistance;
};
