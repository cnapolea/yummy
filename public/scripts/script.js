(function () {
  window.addEventListener(
    'load',
    () => {
      let userLocation;
      const findNearDivElement = document.getElementById(
        'find-discoveries-near'
      );
      const allowLocationAccessBtn = document.querySelector(
        '#find-discoveries-near button'
      );
      const nearYouSection = document.getElementById('near-you');

      let getPosition = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

      allowLocationAccessBtn.addEventListener('click', () => {
        getPosition()
          .then((location) => {
            userLocation = location;
            const { longitude, latitude } = location.coords;

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
            const dotsDivElement = document.createElement('div');
            dotsDivElement.className = 'dots';

            const nearYouGliderElement = document.getElementById('glider-2');
            nearYouSection.appendChild(dotsDivElement);

            findNearDivElement.style.display = 'none';
            nearYouSection.className = 'centering-container';
            nearYouSection.style.display = 'block';

            new Glider(nearYouGliderElement, {
              slidesToShow: 1,
              dots: nearYouSection.lastChild,
              // exactWidth: true,
              draggable: true,
              arrows: {
                prev: '.glider-prev',
                next: '.glider-next'
              }
            });
          })
          .catch((error) => {
            findNearDivElement.className = 'show centering-container';
            findNearDivElement.children[1].className =
              'hide-element centering-container';
            findNearDivElement.children[2].style.display = 'block';
          });
      });
    },
    false
  );
})();
