(function () {
  window.addEventListener(
    'load',
    () => {
      let userLocation;

      let getPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      getPosition()
        .then((location) => {
          userLocation = location;
          const { longitude, latitude } = location.coords;
          console.log(location);

          return fetch(
            `/restaurants/location?lon=${longitude}&lat=${latitude}`
          );
        })
        .then((data) => {
          console.log(data.status);
          if (data.status === 200) {
            return data.json();
          }
        })
        .then((data) => {
          data.forEach(createRestaurantCard);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    false
  );
})();
