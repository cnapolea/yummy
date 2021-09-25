function createRestaurantCard(restaurant) {
  const cardsContainerElement =
    document.querySelectorAll('.cards-container')[1];
  const restautantCardElement = document.createElement('div');
  const restaurantImageElement = document.createElement('img');
  const restaurantInformationElement = document.createElement('div');
  const h3NameElement = document.createElement('h3');
  const smallRatingElement = document.createElement('small');
  const ratingImageElement = document.createElement('img');
  const restaurantDetailsElement = document.createElement('div');
  const smallPriceElement = document.createElement('small');
  const smallDistanceElement = document.createElement('small');
  const distanceSpanElement = document.createElement('span');

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
