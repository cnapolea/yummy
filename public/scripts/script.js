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
          if (data.status === 200) {
            return data.json();
          }
        })
        .then((data) => {
          data.forEach(createRestaurantCard);
          const nearYouElement = document.querySelector('#near-you');
          const dotsDivElement = document.createElement('div');
          dotsDivElement.className = 'dots';

          const nearYouGliderElement = document.getElementById('glider-2');
          nearYouElement.appendChild(dotsDivElement);
          console.log(nearYouElement);

          new Glider(nearYouGliderElement, {
            slidesToShow: 1,
            dots: nearYouElement.lastChild,
            // exactWidth: true,
            draggable: true,
            arrows: {
              prev: '.glider-prev',
              next: '.glider-next'
            }
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    false
  );
})();
