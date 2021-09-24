function createRestaurantCard(restaurant) {
  let cardsContainerElement = document.querySelector('.cards-container');
  let restautantCardElement = document.createElement('div');
  let restaurantImageElement = document.createElement('img');
  let restaurantInformationElement = document.createElement('div');
  let h3NameElement = document.createElement('h3');
  let smallRatingElement = document.createElement('small');
  let ratingImageElement = document.createElement('img');
  let restaurantDetailsElement = document.createElement('div');
  let smallPriceElement = document.createElement('small');
  let smallDistanceElement = document.createElement('small');
  let distanceSpanElement = document.createElement('span');

  const restaurantObj = restaurant[0];
  const restaurantDistance = restaurant[1];

  restaurantImageElement.src = restaurantObj.image;
  restaurantImageElement.alt = restaurantObj.name;
  ratingImageElement.src = '/images/star.svg';
  ratingImageElement.alt = 'rating star';

  h3NameElement.innerText = restaurantObj.name;
  smallRatingElement.innerText = restaurantObj.rating;
  smallPriceElement.innerText = restaurantObj.price;

  smallDistanceElement.innerHTML = restaurantDistance.toPrecision(2);
  smallDistanceElement.className = 'distance-to-user';

  restautantCardElement.className = 'restaurant-card';
  restaurantInformationElement.className = 'restaurant-information';
  restaurantDetailsElement.className = 'restaurant-details';

  ratingImageElement.className = 'rating-img';

  smallRatingElement.className = 'rating';

  distanceSpanElement.innerHTML = 'km';

  cardsContainerElement.appendChild(restautantCardElement);

  restautantCardElement.appendChild(restaurantImageElement);
  restautantCardElement.appendChild(restaurantInformationElement);

  restaurantInformationElement.appendChild(h3NameElement);
  restaurantInformationElement.appendChild(smallRatingElement);
  restaurantInformationElement.appendChild(smallDistanceElement);
  restaurantInformationElement.appendChild(restaurantDetailsElement);

  smallDistanceElement.appendChild(distanceSpanElement);

  smallRatingElement.appendChild(ratingImageElement);

  restaurantDetailsElement.appendChild(smallPriceElement);
}
