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
          return data.json();
        })
        .then((data) => {})
        .catch((error) => {
          console.log(error);
        });

      console.log(userLocation);
    },
    false
  );
})();
