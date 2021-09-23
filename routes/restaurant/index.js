// jshint esversion:10

require('dotenv').config();
const Restaurant = require('../../models/restaurant');
const User = require('../../models/user');
const { Router } = require('express');
const router = Router();
const upload = require('../../middleware/file-upload');
const axios = require('axios');

// Function that formats GEOCODING URL
const GEOCODING_URL = require('./getLngLat');
// Function that sorts by proximity
const restaurantsSorted = require('./sortByProximity');

const EARTH_RADIUS = 3963.2;

// import middlewares
const routeGuard = require('../../middleware/route-guard');

// GET request to display restaurants (divided into sections)
router.get('/', (req, res, next) => {
  // console.log(req.query);
  Restaurant.find()
    .limit(10)
    .sort({
      rating: -1
    })
    .then((restaurants) => {
      res.render('restaurant/restaurants', {
        restaurants
      });
    })
    .catch((error) => next(error));
});

router.post('/', (req, res, next) => {
  const { searchedText, city, rating, price } = req.body;

  Restaurant.find({
    city,
    rating,
    price,
    $text: {
      $search: searchedText
    }
  })
    .then((restaurants) => {
      res.render('restaurants', {
        restaurants
      });
    })
    .catch((error) => next(error));
});

// GET request to take to the create form view
router.get('/create', routeGuard, (req, res, next) => {
  res.render('restaurant/create-restaurant');
});

// POST request to create a restaurant document in the DB
router.post('/create', routeGuard, upload.single('image'), (req, res, next) => {
  const { name, address1, postalCode, city, country, cousine, price, rating } =
    req.body;
  let image;
  console.log(req.file);
  if (req.file) {
    image = req.file.path;
  }

  let restaurantID;

  axios
    .get(GEOCODING_URL(req.body))
    .then((address) => {
      const { lat, lng } = address.data.results[0].geometry.location;
      return Restaurant.create({
        name,
        image,
        position: {
          coordinates: [lng, lat]
        },
        cousine,
        price,
        creator: req.user._id,
        rating
      });
    })
    .then((restaurant) => {
      restaurantID = restaurant._id;
      console.log(restaurantID);
      return User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { discoveries: restaurantID }
        },
        { new: true }
      );
    })
    .then((creator) => {
      console.log(creator);
      res.redirect('/restaurants');
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

router.get('/location', (req, res, next) => {
  const { lon, lat } = req.query;

  // Using this route to handle all request from the client side regarding user's current location.

  // Using MongoDB geoWithin and centerSphere to be able to get restaurants locations within a radious of 10 miles -- to be changed to meters

  Restaurant.find({
    position: {
      $geoWithin: {
        $centerSphere: [[lon, lat], 10 / EARTH_RADIUS]
      }
    }
  })
    .then((restaurants) => {
      // Adding distance from user location in order to sort data and send it to client side
      console.log(restaurants);
      res.json(restaurantsSorted(restaurants, lon, lat));
      // res.end();
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/restaurant/:id', (req, res, next) => {
  const { id } = req.params;
  Restaurant.findById(id)
    .then((restaurant) => {
      res.render('restaurant', {
        restaurant
      });
    })
    .catch((error) => next(error));
});

module.exports = router;
