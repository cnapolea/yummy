function createRestaurantCard(restaurant) {
  const nearYouSectionElement = document.getElementById('near-you');
  let divElement = document.createElement('div');
  let imgElement = document.createElement('img');
  let pNameElement = document.createElement('p');
  let pRatingElement = document.createElement('p');
  let pPriceElement = document.createElement('p');
  let smallDistanceElement = document.createElement('small');

  const restaurantObj = restaurant[0];
  const restaurantDistance = restaurant[1];

  imgElement.src = restaurantObj.image;
  imgElement.alt = restaurantObj.name;

  pNameElement.innerText = restaurantObj.name;
  pRatingElement.innerText = restaurantObj.rating;
  pPriceElement.innerText = restaurantObj.price;

  smallDistanceElement.innerHTML = restaurantDistance;

  divElement.className = 'restaurant-card';

  nearYouSectionElement.appendChild(divElement);
  divElement.appendChild(imgElement);
  divElement.appendChild(pNameElement);
  divElement.appendChild(pRatingElement);
  divElement.appendChild(pPriceElement);

  pNameElement.appendChild(smallDistanceElement);
}
