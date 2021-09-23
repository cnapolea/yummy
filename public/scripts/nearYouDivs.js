function createRestaurantCard(restaurant) {
  let divElement = document.querySelector('.cards-container');
  let restautantCardElement = document.createElement('div');
  let imgElement = document.createElement('img');
  let h3NameElement = document.createElement('h3');
  let smallRatingElement = document.createElement('small');
  let smallPriceElement = document.createElement('small');
  let smallDistanceElement = document.createElement('small');

  const restaurantObj = restaurant[0];
  const restaurantDistance = restaurant[1];

  imgElement.src = restaurantObj.image;
  imgElement.alt = restaurantObj.name;

  h3NameElement.innerText = restaurantObj.name;
  smallRatingElement.innerText = restaurantObj.rating;
  smallPriceElement.innerText = restaurantObj.price;

  smallDistanceElement.innerHTML = restaurantDistance;

  restautantCardElement.className = 'restaurant-card';

  divElement.appendChild(restautantCardElement);
  restautantCardElement.appendChild(h3NameElement);
  restautantCardElement.appendChild(imgElement);
  restautantCardElement.appendChild(smallRatingElement);
  restautantCardElement.appendChild(smallPriceElement);
  restautantCardElement.appendChild(smallDistanceElement);
}
